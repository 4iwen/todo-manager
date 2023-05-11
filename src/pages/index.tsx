import Canvas from '@/components/Canvas'
import { addBoard, getBoards } from '../../firebaseConfig'
import { useEffect, useState } from 'react'

export interface IBoard {
  id: string
  name: string
  items: IItem[]
}

export interface IItem {
  id: string
  description: string
  checked: boolean
}

function extractData(rawData: any): IBoard[] {
  const boards: IBoard[] = []
  for (const board of rawData) {
    const items: IItem[] = []
    for (const item of board.items) {
      items.push({
        id: item.id,
        description: item.description,
        checked: item.checked,
      })
    }
    boards.push({ id: board.id, name: board.name, items: items })
  }

  return boards
}

export default function Home() {
  const [boards, setBoards] = useState<IBoard[]>([])

  useEffect(() => {
    ;(async () => {
      const boardsRaw = await getBoards()
      const boards = extractData(boardsRaw)
      setBoards(boards)
    })()
  }, [])

  useEffect(() => {
    console.log(boards)
  }, [boards])

  return <Canvas boards={boards} setBoards={setBoards} />
}
