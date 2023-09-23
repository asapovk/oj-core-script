import { ITriggers } from './types';
import { IState } from './types';
import { DispatcherType, HookerType, WaiterType } from '@reflexio/reflexio-on-redux/lib/types';
import { getActionType } from '@reflexio/reflexio-on-redux/lib/utils';
import { useSystem } from '@reflexio/reflexio-on-redux';
import store from '.';

class AppStore {

  static instance: AppStore;

  static getInstance() {
    if(!AppStore.instance) {
      return new AppStore();
    }
    else {
      return AppStore.instance
    }
  }

  constructor () {
    this.system = useSystem();
    this.store = store;
  }

  private store;

  private system;

  private waits = {};

  private addWait = (trigger: string, {resolve, reject}, timeout) => {
    const timeOutId = setTimeout(()=> {
      if(this.waits[trigger]) {
         this.waits[trigger].reject(`${trigger} TIMEOUT`)
      } 
    }, timeout || 15000)
    this.waits[trigger] = {resolve, reject, id: timeOutId}
  }

  private resolveWait(trigger: string, args) {
    if(this.waits[trigger]) {
      this.waits[trigger].resolve(args)
      clearTimeout(this.waits[trigger].id)
      delete(this.waits[trigger])
    }
  }

  //@ts-ignore
  public hook: HookerType<ITriggers> = (actionType, actionStatusStart, actionStatusStop, startPAyload, timeout) => {
    //@ts-ignore
    const requestId = startPAyload.requestId as string;
    const combynedTypeStart = getActionType(actionType as string, actionStatusStart as string);
    const combynedTypeStop = getActionType(actionType as string, actionStatusStop as string);
    const subscribtion = this.subscribe(actionType, actionStatusStop, requestId)
    setTimeout(() => {
        store.dispatch({
            type: combynedTypeStart,
            payload: startPAyload,
        });
    }, 0)  
    return new Promise((resolve, reject) => { 
        this.addWait(`${combynedTypeStop}:${requestId}`, {resolve, reject}, timeout);
    })
    .finally( () => {
       subscribtion()
     }) 
  };

  private subscribe = (trigger, status, requestId: string) => {
    return this.store.subscribe(() => {
      const task = this.system.taksQueue.getCurrentTask()
      const requestId = task.payload.requestId;
      if(task.payload.requestId) {
        const taskActionType = `${task.type}:${task.payload.requestId}`
        const actionType = `${trigger}/${status}:${requestId}`
        if(actionType === taskActionType) {
          if(this.waits[actionType]) {
            this.resolveWait(actionType, task.payload);
          }
        }
      }
    })
  }
  

  public trigger: DispatcherType<ITriggers> = (trigger, status, payload) => {
    const combynedType = getActionType(trigger as string, status as string);
    this.store.dispatch({ type: combynedType, payload });
  };

  public getState = () => this.store.getState() as IState;
}



export default AppStore.getInstance();