// Temporary local data adapter for the GPT Sites copy.
//
// The original catalog used a legacy Supabase project that is intentionally
// NOT required by this branch. The UI, routes and localStorage-based saved
// poses continue to work while the new photo/data backend is decided.
//
// When the definitive backend is ready, replace this adapter with the new
// client without changing the presentation layer.

type QueryResult = {
  data: any;
  error: null;
};

class LocalQuery {
  select(..._args: any[]) { return this; }
  eq(..._args: any[]) { return this; }
  neq(..._args: any[]) { return this; }
  in(..._args: any[]) { return this; }
  order(..._args: any[]) { return this; }
  limit(..._args: any[]) { return this; }
  range(..._args: any[]) { return this; }
  match(..._args: any[]) { return this; }
  contains(..._args: any[]) { return this; }
  filter(..._args: any[]) { return this; }

  async single(): Promise<QueryResult> {
    return { data: null, error: null };
  }

  async maybeSingle(): Promise<QueryResult> {
    return { data: null, error: null };
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve<QueryResult>({ data: [], error: null }).then(onfulfilled, onrejected);
  }
}

const emptySubscription = {
  unsubscribe() {},
};

export const supabase: any = {
  from(_table: string) {
    return new LocalQuery();
  },

  auth: {
    async getSession() {
      return { data: { session: null }, error: null };
    },
    async getUser() {
      return { data: { user: null }, error: null };
    },
    onAuthStateChange() {
      return { data: { subscription: emptySubscription } };
    },
    async signOut() {
      return { error: null };
    },
  },
};
