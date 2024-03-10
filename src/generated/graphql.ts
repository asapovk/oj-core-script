import { GraphQLResolveInfo } from 'graphql/type';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Authenticate = {
  __typename?: 'Authenticate';
  data?: Maybe<PublicLinkData>;
  errorCode?: Maybe<Scalars['String']['output']>;
  isMaster?: Maybe<Scalars['Boolean']['output']>;
  session?: Maybe<Scalars['String']['output']>;
};

export type AuthenticateInput = {
  link: Scalars['String']['input'];
  login?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type Chapter = {
  __typename?: 'Chapter';
  audioUrl?: Maybe<Scalars['String']['output']>;
  chapterContent: Scalars['String']['output'];
  chapterId: Scalars['Int']['output'];
  isTop: Scalars['Boolean']['output'];
  serieId: Scalars['Int']['output'];
};

export type ChaptersInput = {
  chapterIds: Array<Scalars['Int']['input']>;
};

export type CheckSessionResult = {
  __typename?: 'CheckSessionResult';
  isAuth: Scalars['Boolean']['output'];
  isMaster?: Maybe<Scalars['Boolean']['output']>;
};

export type Client = {
  __typename?: 'Client';
  dtCreate: Scalars['String']['output'];
  dtExpire?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  group: Group;
  invite?: Maybe<Invite>;
  password?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  plan?: Maybe<Scalars['String']['output']>;
  tgId?: Maybe<Scalars['String']['output']>;
  tgUsername?: Maybe<Scalars['String']['output']>;
  userId: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type ClientsInput = {
  accessStatus?: InputMaybe<Scalars['String']['input']>;
  dtInvite?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  groupId?: InputMaybe<Scalars['Int']['input']>;
  inviteId?: InputMaybe<Scalars['Int']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};

export type CreateGroupInput = {
  groupName: Scalars['String']['input'];
};

export type CreateInviteInput = {
  dtExpire?: InputMaybe<Scalars['String']['input']>;
  groupId: Scalars['Int']['input'];
  nameInvite: Scalars['String']['input'];
};

export type CreatePublicLink = {
  __typename?: 'CreatePublicLink';
  data?: Maybe<Scalars['Int']['output']>;
  errorCode?: Maybe<Scalars['String']['output']>;
};

export type CreatePublicLinkInput = {
  end?: InputMaybe<Scalars['String']['input']>;
  linkValue: Scalars['String']['input'];
  serieId: Scalars['Int']['input'];
  start?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWordstampInput = {
  chapterId?: InputMaybe<Scalars['Int']['input']>;
  kana?: InputMaybe<Scalars['String']['input']>;
  serieId?: InputMaybe<Scalars['Int']['input']>;
  transcription?: InputMaybe<Scalars['String']['input']>;
  translation?: InputMaybe<Scalars['String']['input']>;
  writing: Scalars['String']['input'];
};

export type DeleteInviteInput = {
  inviteId: Scalars['Int']['input'];
};

export type Group = {
  __typename?: 'Group';
  dtCreate: Scalars['String']['output'];
  groupId: Scalars['Int']['output'];
  groupName: Scalars['String']['output'];
};

export type Invite = {
  __typename?: 'Invite';
  dtCreate?: Maybe<Scalars['String']['output']>;
  dtExpire?: Maybe<Scalars['String']['output']>;
  inviteId: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  plan: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  useCount: Scalars['Int']['output'];
};

export type InvitesInput = {
  groupId?: InputMaybe<Scalars['Int']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type ManageGroupMomentInput = {
  addMomentIds: Array<Scalars['Int']['input']>;
  deleteMomentIds: Array<Scalars['Int']['input']>;
  groupId: Scalars['Int']['input'];
};

export type ManageGroupUserInput = {
  addUserIds: Array<Scalars['Int']['input']>;
  deleteUserIds: Array<Scalars['Int']['input']>;
  groupId: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGroup: Scalars['Int']['output'];
  createInvite: Invite;
  createPublicLink: CreatePublicLink;
  createWordstamp: Scalars['Int']['output'];
  deleleInvite: Scalars['Boolean']['output'];
  manageGroupMoment: Scalars['Boolean']['output'];
  manageGroupUser: Scalars['Boolean']['output'];
  saveQuizResult: Scalars['Int']['output'];
  updateGroup: Scalars['Boolean']['output'];
  updateScript: Scalars['Boolean']['output'];
  updateSerie: Scalars['Boolean']['output'];
  useGroupInviete: Scalars['Boolean']['output'];
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateInviteArgs = {
  input: CreateInviteInput;
};


export type MutationCreatePublicLinkArgs = {
  input: CreatePublicLinkInput;
};


export type MutationCreateWordstampArgs = {
  input: CreateWordstampInput;
};


export type MutationDeleleInviteArgs = {
  input?: InputMaybe<DeleteInviteInput>;
};


export type MutationManageGroupMomentArgs = {
  input: ManageGroupMomentInput;
};


export type MutationManageGroupUserArgs = {
  input: ManageGroupUserInput;
};


export type MutationSaveQuizResultArgs = {
  input: SaveQuizResultInput;
};


export type MutationUpdateGroupArgs = {
  input: UpdateGroupInput;
};


export type MutationUpdateScriptArgs = {
  input: UpdateScriptInput;
};


export type MutationUpdateSerieArgs = {
  input: UpdateSerieInput;
};


export type MutationUseGroupInvieteArgs = {
  input: UseGroupInviteInput;
};

export type PublicLinkData = {
  __typename?: 'PublicLinkData';
  end?: Maybe<Scalars['String']['output']>;
  linkValue?: Maybe<Scalars['String']['output']>;
  serieId?: Maybe<Scalars['Int']['output']>;
  start?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  authenticate: Authenticate;
  chapters: Array<Chapter>;
  checkSession: CheckSessionResult;
  clients: Array<Client>;
  groups: Array<Group>;
  invites: Array<Invite>;
  loadGroupedWordStamps: Array<WordStampsGroup>;
  signIn: SignInResult;
  singleSerie: Array<Serie>;
};


export type QueryAuthenticateArgs = {
  input: AuthenticateInput;
};


export type QueryChaptersArgs = {
  input: ChaptersInput;
};


export type QueryClientsArgs = {
  input: ClientsInput;
};


export type QueryInvitesArgs = {
  input: InvitesInput;
};


export type QuerySignInArgs = {
  input: SignInInput;
};


export type QuerySingleSerieArgs = {
  input: SingleSerieInput;
};

export type SaveQuizResultInput = {
  value: Scalars['String']['input'];
};

export type Serie = {
  __typename?: 'Serie';
  description?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  isScriptVerified: Scalars['Boolean']['output'];
  likes: Scalars['Int']['output'];
  movieId: Scalars['Int']['output'];
  ruScript?: Maybe<Scalars['String']['output']>;
  script?: Maybe<Scalars['String']['output']>;
  scriptId?: Maybe<Scalars['Int']['output']>;
  serieId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  videoUrl?: Maybe<Scalars['String']['output']>;
  views: Scalars['Int']['output'];
};

export type SignInInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInResult = {
  __typename?: 'SignInResult';
  errorCode?: Maybe<Scalars['String']['output']>;
  session?: Maybe<Scalars['String']['output']>;
};

export type SingleSerieInput = {
  serieId: Scalars['Int']['input'];
};

export type UpdateGroupInput = {
  groupId: Scalars['Int']['input'];
  groupName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateScriptInput = {
  body: Scalars['String']['input'];
  serieId: Scalars['Int']['input'];
};

export type UpdateSerieInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  script?: InputMaybe<Scalars['String']['input']>;
  scriptId?: InputMaybe<Scalars['Int']['input']>;
  serieId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UseGroupInviteInput = {
  inviteToken: Scalars['String']['input'];
};

export type WordStamp = {
  __typename?: 'WordStamp';
  chapterId: Scalars['Int']['output'];
  kana: Scalars['String']['output'];
  levelOfKnowledge: Scalars['Int']['output'];
  numberOfTests: Scalars['Int']['output'];
  transcription: Scalars['String']['output'];
  translation: Scalars['String']['output'];
  wordStampId: Scalars['Int']['output'];
  writing: Scalars['String']['output'];
};

export type WordStampsGroup = {
  __typename?: 'WordStampsGroup';
  moviedId: Scalars['Int']['output'];
  serieId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  wordStamps: Array<WordStamp>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Authenticate: ResolverTypeWrapper<Authenticate>;
  AuthenticateInput: AuthenticateInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Chapter: ResolverTypeWrapper<Chapter>;
  ChaptersInput: ChaptersInput;
  CheckSessionResult: ResolverTypeWrapper<CheckSessionResult>;
  Client: ResolverTypeWrapper<Client>;
  ClientsInput: ClientsInput;
  CreateGroupInput: CreateGroupInput;
  CreateInviteInput: CreateInviteInput;
  CreatePublicLink: ResolverTypeWrapper<CreatePublicLink>;
  CreatePublicLinkInput: CreatePublicLinkInput;
  CreateWordstampInput: CreateWordstampInput;
  DeleteInviteInput: DeleteInviteInput;
  Group: ResolverTypeWrapper<Group>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Invite: ResolverTypeWrapper<Invite>;
  InvitesInput: InvitesInput;
  ManageGroupMomentInput: ManageGroupMomentInput;
  ManageGroupUserInput: ManageGroupUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  PublicLinkData: ResolverTypeWrapper<PublicLinkData>;
  Query: ResolverTypeWrapper<{}>;
  SaveQuizResultInput: SaveQuizResultInput;
  Serie: ResolverTypeWrapper<Serie>;
  SignInInput: SignInInput;
  SignInResult: ResolverTypeWrapper<SignInResult>;
  SingleSerieInput: SingleSerieInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateGroupInput: UpdateGroupInput;
  UpdateScriptInput: UpdateScriptInput;
  UpdateSerieInput: UpdateSerieInput;
  UseGroupInviteInput: UseGroupInviteInput;
  WordStamp: ResolverTypeWrapper<WordStamp>;
  WordStampsGroup: ResolverTypeWrapper<WordStampsGroup>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Authenticate: Authenticate;
  AuthenticateInput: AuthenticateInput;
  Boolean: Scalars['Boolean'];
  Chapter: Chapter;
  ChaptersInput: ChaptersInput;
  CheckSessionResult: CheckSessionResult;
  Client: Client;
  ClientsInput: ClientsInput;
  CreateGroupInput: CreateGroupInput;
  CreateInviteInput: CreateInviteInput;
  CreatePublicLink: CreatePublicLink;
  CreatePublicLinkInput: CreatePublicLinkInput;
  CreateWordstampInput: CreateWordstampInput;
  DeleteInviteInput: DeleteInviteInput;
  Group: Group;
  Int: Scalars['Int'];
  Invite: Invite;
  InvitesInput: InvitesInput;
  ManageGroupMomentInput: ManageGroupMomentInput;
  ManageGroupUserInput: ManageGroupUserInput;
  Mutation: {};
  PublicLinkData: PublicLinkData;
  Query: {};
  SaveQuizResultInput: SaveQuizResultInput;
  Serie: Serie;
  SignInInput: SignInInput;
  SignInResult: SignInResult;
  SingleSerieInput: SingleSerieInput;
  String: Scalars['String'];
  UpdateGroupInput: UpdateGroupInput;
  UpdateScriptInput: UpdateScriptInput;
  UpdateSerieInput: UpdateSerieInput;
  UseGroupInviteInput: UseGroupInviteInput;
  WordStamp: WordStamp;
  WordStampsGroup: WordStampsGroup;
};

export type AuthenticateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Authenticate'] = ResolversParentTypes['Authenticate']> = {
  data?: Resolver<Maybe<ResolversTypes['PublicLinkData']>, ParentType, ContextType>;
  errorCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isMaster?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  session?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChapterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Chapter'] = ResolversParentTypes['Chapter']> = {
  audioUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chapterContent?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chapterId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isTop?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  serieId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckSessionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CheckSessionResult'] = ResolversParentTypes['CheckSessionResult']> = {
  isAuth?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isMaster?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = {
  dtCreate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dtExpire?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType>;
  invite?: Resolver<Maybe<ResolversTypes['Invite']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  plan?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tgId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tgUsername?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatePublicLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePublicLink'] = ResolversParentTypes['CreatePublicLink']> = {
  data?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  errorCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  dtCreate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  groupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  groupName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InviteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invite'] = ResolversParentTypes['Invite']> = {
  dtCreate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dtExpire?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  inviteId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  plan?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  useCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createGroup?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationCreateGroupArgs, 'input'>>;
  createInvite?: Resolver<ResolversTypes['Invite'], ParentType, ContextType, RequireFields<MutationCreateInviteArgs, 'input'>>;
  createPublicLink?: Resolver<ResolversTypes['CreatePublicLink'], ParentType, ContextType, RequireFields<MutationCreatePublicLinkArgs, 'input'>>;
  createWordstamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationCreateWordstampArgs, 'input'>>;
  deleleInvite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleleInviteArgs, never>>;
  manageGroupMoment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationManageGroupMomentArgs, 'input'>>;
  manageGroupUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationManageGroupUserArgs, 'input'>>;
  saveQuizResult?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationSaveQuizResultArgs, 'input'>>;
  updateGroup?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateGroupArgs, 'input'>>;
  updateScript?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateScriptArgs, 'input'>>;
  updateSerie?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateSerieArgs, 'input'>>;
  useGroupInviete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUseGroupInvieteArgs, 'input'>>;
};

export type PublicLinkDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicLinkData'] = ResolversParentTypes['PublicLinkData']> = {
  end?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  linkValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  serieId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authenticate?: Resolver<ResolversTypes['Authenticate'], ParentType, ContextType, RequireFields<QueryAuthenticateArgs, 'input'>>;
  chapters?: Resolver<Array<ResolversTypes['Chapter']>, ParentType, ContextType, RequireFields<QueryChaptersArgs, 'input'>>;
  checkSession?: Resolver<ResolversTypes['CheckSessionResult'], ParentType, ContextType>;
  clients?: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientsArgs, 'input'>>;
  groups?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType>;
  invites?: Resolver<Array<ResolversTypes['Invite']>, ParentType, ContextType, RequireFields<QueryInvitesArgs, 'input'>>;
  loadGroupedWordStamps?: Resolver<Array<ResolversTypes['WordStampsGroup']>, ParentType, ContextType>;
  signIn?: Resolver<ResolversTypes['SignInResult'], ParentType, ContextType, RequireFields<QuerySignInArgs, 'input'>>;
  singleSerie?: Resolver<Array<ResolversTypes['Serie']>, ParentType, ContextType, RequireFields<QuerySingleSerieArgs, 'input'>>;
};

export type SerieResolvers<ContextType = any, ParentType extends ResolversParentTypes['Serie'] = ResolversParentTypes['Serie']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isLiked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isScriptVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  movieId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ruScript?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  script?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scriptId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  serieId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  videoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignInResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignInResult'] = ResolversParentTypes['SignInResult']> = {
  errorCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  session?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WordStampResolvers<ContextType = any, ParentType extends ResolversParentTypes['WordStamp'] = ResolversParentTypes['WordStamp']> = {
  chapterId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  kana?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  levelOfKnowledge?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  numberOfTests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transcription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wordStampId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  writing?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WordStampsGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['WordStampsGroup'] = ResolversParentTypes['WordStampsGroup']> = {
  moviedId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  serieId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wordStamps?: Resolver<Array<ResolversTypes['WordStamp']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Authenticate?: AuthenticateResolvers<ContextType>;
  Chapter?: ChapterResolvers<ContextType>;
  CheckSessionResult?: CheckSessionResultResolvers<ContextType>;
  Client?: ClientResolvers<ContextType>;
  CreatePublicLink?: CreatePublicLinkResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  Invite?: InviteResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PublicLinkData?: PublicLinkDataResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Serie?: SerieResolvers<ContextType>;
  SignInResult?: SignInResultResolvers<ContextType>;
  WordStamp?: WordStampResolvers<ContextType>;
  WordStampsGroup?: WordStampsGroupResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
