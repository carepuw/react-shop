export type Post = {
  id: number,
  text: string,
  price: number,
  creationDate: Date,
  activeTime: string,
  img: string,
  author: {
    id: number,
    name: string
  }
}

export type PurshasedPost = {
  id: number,
  text: string,
  src: string,
  price: number,
}

export type ProfileData = {
  allPosts: [number],
  userPurshased: [PurshasedPost] | [],
  purshasedUserPosts: [PurshasedPost] | [],
  src: string
} | null

export type User = {
  name: string,
  email: string,
  password: string,
  id: number,
  money: number,
  createdAt: string,
  allPosts: [number]
} | null

export type SystemState = {
  loggedIn: boolean,
  user: User
}
