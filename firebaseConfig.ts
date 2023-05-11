import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore'
import { getDocs } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD6RXyifYTSD7bYjPWV3B2QJWim5EXJYv0',
  authDomain: 'todo-manager-cfb5f.firebaseapp.com',
  projectId: 'todo-manager-cfb5f',
  storageBucket: 'todo-manager-cfb5f.appspot.com',
  messagingSenderId: '654753687078',
  appId: '1:654753687078:web:dec92c8427a28a81ace8e7',
  measurementId: 'G-MGEPQCJXTS',
}

export const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export async function getBoards() {
  const boards = collection(db, 'boards')
  const boardsSnapshot = await getDocs(boards)
  const boardNames = boardsSnapshot.docs.map((doc) => doc.data().name)
  const boardIds = boardsSnapshot.docs.map((doc) => doc.id)
  const data = boardIds.map(async (id) => {
    const items = collection(db, `boards/${id}/items`)
    const itemsSnapshot = await getDocs(items)
    const itemsIds = itemsSnapshot.docs.map((doc) => doc.id)
    const itemsData = itemsSnapshot.docs.map((doc) => doc.data())
    itemsData.forEach((item, index) => {
      item.id = itemsIds[index]
    })
    const boardName = boardNames[boardIds.indexOf(id)]
    return { id: id, items: itemsData, name: boardName }
  })

  return await Promise.all(data)
}

export async function getBoard(boardId: string) {
  const board = doc(db, `boards/${boardId}`)
  const boardSnapshot = await getDoc(board)
  const boardName = boardSnapshot.data()?.name || 'New Board'
  const items = collection(db, `boards/${boardId}/items`)
  const itemsSnapshot = await getDocs(items)
  const itemsIds = itemsSnapshot.docs.map((doc) => doc.id)
  const itemsData = itemsSnapshot.docs.map((doc) => doc.data())
  itemsData.forEach((item, index) => {
    item.id = itemsIds[index]
  })
  return { id: boardId, items: itemsData, name: boardName }
}

export async function addBoard() {
  const boards = collection(db, 'boards')

  return await addDoc(boards, { name: 'New Board' }).then((docRef) => {
    const items = collection(db, `boards/${docRef.id}/items`)
    addDoc(items, { description: 'New Item', checked: false })
    return docRef.id
  })
}

export async function updateBoard(boardId: string, name: string) {
  const board = doc(db, `boards/${boardId}`)
  await setDoc(board, {
    name: name,
  })
}

export async function deleteBoard(boardId: string) {
  await deleteDoc(doc(db, `boards/${boardId}`))
}

export async function getItem(boardId: string, itemId: string) {
  const item = doc(db, `boards/${boardId}/items/${itemId}`)
  const itemSnapshot = await getDoc(item)
  return itemSnapshot.data()
}

export async function addItem(boardId: string) {
  const items = collection(db, `boards/${boardId}/items`)
  return await addDoc(items, { description: 'New Item', checked: false }).then(
    (docRef) => {
      return docRef.id
    }
  )
}

export async function updateItem(
  boardId: string,
  itemId: string,
  description: string,
  checked: boolean
) {
  const item = doc(db, `boards/${boardId}/items/${itemId}`)
  await setDoc(item, {
    description: description,
    checked: checked,
  })
}

export async function deleteItem(boardId: string, itemId: string) {
  await deleteDoc(doc(db, `boards/${boardId}/items/${itemId}`))
}
