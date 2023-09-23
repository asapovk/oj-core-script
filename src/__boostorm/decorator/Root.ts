import rtg from '../script/ReturnTypeGenerator';

export const Root = (
  argPassed:
    | 'Fetch'
    | 'Insert'
    | 'Update'
    | 'Select'
    | 'SelectUnsafe'
    | 'SelectWith',
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      // const rtg = RoottgI.getReturnTypeGenerator()
      if (rtg) {
        rtg.pushArgs({
          args: args,
          root: argPassed,
        });
      } else {
        // console.log('Root is null');
      }
      const result = originalMethod.apply(this, args);
      return result;
    };
  };
};
