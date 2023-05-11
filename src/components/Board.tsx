import Item from '@/components/Item'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { IBoard } from '@/pages'
import {
  addItem,
  deleteBoard,
  getItem,
  updateBoard,
} from '../../firebaseConfig'

interface BoardProps {
  board: IBoard
  setBoards: any
}

export default function Board(props: BoardProps) {
  return (
    <Card sx={{ minWidth: 275, maxWidth: 300, margin: '1rem' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            size="medium"
            value={props.board.name}
            onChange={async (e) => {
              props.setBoards((prev: IBoard[]) => {
                const newBoards = [...prev]
                const index = newBoards.findIndex(
                  (board: IBoard) => board.id === props.board.id
                )
                newBoards[index].name = e.target.value
                return newBoards
              })
              await updateBoard(props.board.id, e.target.value)
            }}
          />
          <IconButton
            aria-label="delete item"
            onClick={async () => {
              props.setBoards((prev: IBoard[]) => {
                const newBoards = [...prev]
                console.log(newBoards)
                const index = newBoards.findIndex(
                  (board: IBoard) => board.id === props.board.id
                )

                newBoards.splice(index, 1)
                return newBoards
              })

              await deleteBoard(props.board.id)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        {props.board.items.map((item, index) => {
          return (
            <Item
              key={index}
              boardId={props.board.id}
              item={item}
              setBoards={props.setBoards}
            />
          )
        })}
      </CardContent>
      <CardActions>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={async () => {
            const itemId = await addItem(props.board.id)
            const item = await getItem(props.board.id, itemId)
            props.setBoards((prev: IBoard[]) => {
              const newBoards = [...prev]
              const index = newBoards.findIndex(
                (board: IBoard) => board.id === props.board.id
              )

              const checked = item?.checked || false
              const desc = item?.description || ''

              newBoards[index].items.push({
                id: itemId,
                description: desc,
                checked: checked,
              })
              return newBoards
            })
          }}
        >
          Add Item
        </Button>
      </CardActions>
    </Card>
  )
}
