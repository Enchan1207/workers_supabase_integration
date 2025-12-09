// Worker env
interface Env {
  readonly DATABASE_URL: string
}

declare namespace NodeJS {
  interface ProcessEnv extends Env {}
}
