import { Box, Checkbox, IconButton, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IBoard, IItem } from '@/pages'
import { deleteItem, updateItem } from '../../firebaseConfig'

interface ItemProps {
  boardId: string
  item: IItem
  setBoards: any
}

export default function Item(props: ItemProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {' '}
      <TextField
        id="filled-label-normal"
        variant="standard"
        size="medium"
        margin="dense"
        disabled={props.item.checked}
        value={props.item.description}
        onChange={async (e) => {
          props.setBoards((prev: IBoard[]) => {
            const newBoards = [...prev]
            const boardIndex = newBoards.findIndex(
              (board: IBoard) => board.id === props.boardId
            )
            const itemIndex = newBoards[boardIndex].items.findIndex(
              (item: IItem) => item.id === props.item.id
            )
            newBoards[boardIndex].items[itemIndex].description = e.target.value
            return newBoards
          })

          await updateItem(
            props.boardId,
            props.item.id,
            e.target.value,
            props.item.checked
          )
        }}
      />
      <Checkbox
        checked={props.item.checked}
        onChange={async (e) => {
          props.setBoards((prev: IBoard[]) => {
            const newBoards = [...prev]
            const boardIndex = newBoards.findIndex(
              (board: IBoard) => board.id === props.boardId
            )
            const itemIndex = newBoards[boardIndex].items.findIndex(
              (item: IItem) => item.id === props.item.id
            )
            newBoards[boardIndex].items[itemIndex].checked = e.target.checked
            return newBoards
          })

          await updateItem(
            props.boardId,
            props.item.id,
            props.item.description,
            e.target.checked
          )
        }}
      />
      <IconButton
        aria-label="delete item"
        onClick={async () => {
          props.setBoards((prev: IBoard[]) => {
            const newBoards = [...prev]
            const boardIndex = newBoards.findIndex(
              (board: IBoard) => board.id === props.boardId
            )
            const itemIndex = newBoards[boardIndex].items.findIndex(
              (item: IItem) => item.id === props.item.id
            )
            newBoards[boardIndex].items.splice(itemIndex, 1)
            return newBoards
          })

          await deleteItem(props.boardId, props.item.id)
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  )
}
