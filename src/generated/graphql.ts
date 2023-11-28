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

export type Mutation = {
  __typename?: 'Mutation';
  createPublicLink: CreatePublicLink;
  updateScript: Scalars['Boolean']['output'];
  updateSerie: Scalars['Boolean']['output'];
};


export type MutationCreatePublicLinkArgs = {
  input: CreatePublicLinkInput;
};


export type MutationUpdateScriptArgs = {
  input: UpdateScriptInput;
};


export type MutationUpdateSerieArgs = {
  input: UpdateSerieInput;
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


export type QuerySignInArgs = {
  input: SignInInput;
};


export type QuerySingleSerieArgs = {
  input: SingleSerieInput;
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
  CreatePublicLink: ResolverTypeWrapper<CreatePublicLink>;
  CreatePublicLinkInput: CreatePublicLinkInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  PublicLinkData: ResolverTypeWrapper<PublicLinkData>;
  Query: ResolverTypeWrapper<{}>;
  Serie: ResolverTypeWrapper<Serie>;
  SignInInput: SignInInput;
  SignInResult: ResolverTypeWrapper<SignInResult>;
  SingleSerieInput: SingleSerieInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateScriptInput: UpdateScriptInput;
  UpdateSerieInput: UpdateSerieInput;
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
  CreatePublicLink: CreatePublicLink;
  CreatePublicLinkInput: CreatePublicLinkInput;
  Int: Scalars['Int'];
  Mutation: {};
  PublicLinkData: PublicLinkData;
  Query: {};
  Serie: Serie;
  SignInInput: SignInInput;
  SignInResult: SignInResult;
  SingleSerieInput: SingleSerieInput;
  String: Scalars['String'];
  UpdateScriptInput: UpdateScriptInput;
  UpdateSerieInput: UpdateSerieInput;
  WordStamp: WordStamp;
  WordStampsGroup: WordStampsGroup;
};

export type AuthenticateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Authenticate'] = ResolversParentTypes['Authenticate']> = {
  data?: Resolver<Maybe<ResolversTypes['PublicLinkData']>, ParentType, ContextType>;
  errorCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type CreatePublicLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePublicLink'] = ResolversParentTypes['CreatePublicLink']> = {
  data?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  errorCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPublicLink?: Resolver<ResolversTypes['CreatePublicLink'], ParentType, ContextType, RequireFields<MutationCreatePublicLinkArgs, 'input'>>;
  updateScript?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateScriptArgs, 'input'>>;
  updateSerie?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateSerieArgs, 'input'>>;
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
  CreatePublicLink?: CreatePublicLinkResolvers<ContextType>;
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
