import Board from '@/components/Board'
import { IBoard } from '@/pages'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Typography } from '@mui/material'
import { addBoard, getBoard } from '../../firebaseConfig'

interface CanvasProps {
  boards: IBoard[]
  setBoards: any
}

export default function Canvas(props: CanvasProps) {
  return (
    <Box>
      <Typography margin="1rem" variant="h4" color="black">
        Todo Manager
      </Typography>

      <Box sx={{ display: 'flex' }}>
        {props.boards.map((board: IBoard, index: number) => {
          return <Board key={index} board={board} setBoards={props.setBoards} />
        })}
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ position: 'fixed', top: '0', right: '0', margin: '1rem' }}
        onClick={async () => {
          const boardId = await addBoard()
          const board = await getBoard(boardId)
          props.setBoards((prev: IBoard[]) => [...prev, board])
        }}
      >
        Add Board
      </Button>
    </Box>
  )
}
