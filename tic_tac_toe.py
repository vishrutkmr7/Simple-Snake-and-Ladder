import itertools

BOARD_SIZE = 3  # Size of the board (3x3)

# Constants for the different cell states
EMPTY = 0
PLAYER = 1
AI = 2

# Set up the board as a 2D list
board = [[EMPTY, EMPTY, EMPTY] for _ in range(BOARD_SIZE)]

# Set up the player's symbol
player_symbol = "X"
ai_symbol = "O"


def draw_board():
    """Draw the board on the screen"""
    for row in board:
        print(" ".join(str(cell) if cell == EMPTY else cell for cell in row))


def get_player_move():
    """Get the player's move"""
    col = int(input("Enter column: "))
    row = int(input("Enter row: "))
    return row, col


def get_ai_move():
    """Get the AI's move using minimax"""
    # Initialize the best score to the lowest possible value
    best_score = float("-inf")
    # Initialize the best move to an invalid position
    best_move = (-1, -1)
    # Iterate over all the empty cells
    for row, col in itertools.product(range(BOARD_SIZE), range(BOARD_SIZE)):
        if board[row][col] == EMPTY:
            # Make the move and get the score
            board[row][col] = ai_symbol
            score = minimax(False)
            # Reset the cell to empty
            board[row][col] = EMPTY
            # Update the best score and move if necessary
            if score > best_score:
                best_score = score
                best_move = (row, col)
    return best_move


def minimax(is_ai_turn):
    """Minimax algorithm to determine the best move for the AI"""
    # Check if the AI or the player has won
    result = check_result()
    if result == AI:
        return 1
    elif result == PLAYER:
        return -1
    elif result == "T":  # Tie
        return 0

    # Initialize the best score to the lowest possible value
    best_score = float("-inf") if is_ai_turn else float("inf")
    # Iterate over all the empty cells
    for row, col in itertools.product(range(BOARD_SIZE), range(BOARD_SIZE)):
        if board[row][col] == EMPTY:
            # Make the move and get the score
            if is_ai_turn:
                board[row][col] = ai_symbol
                score = minimax(False)
            else:
                board[row][col] = player_symbol
                score = minimax(True)
            # Reset the cell to empty
            board[row][col] = EMPTY
            # Update the best score if necessary
            best_score = (
                max(best_score, score) if is_ai_turn else min(best_score, score)
            )
    return best_score


def check_result():
    """Check if the game is over and return the winner"""
    # Check if the AI or the player has won
    for symbol in (ai_symbol, player_symbol):
        # Check the rows
        for row in board:
            if all(cell == symbol for cell in row):
                return AI if symbol == ai_symbol else PLAYER
        # Check the columns
        for col in zip(*board):
            if all(cell == symbol for cell in col):
                return AI if symbol == ai_symbol else PLAYER
        # Check the diagonals
        if all(board[i][i] == symbol for i in range(BOARD_SIZE)):
            return AI if symbol == ai_symbol else PLAYER
        if all(board[i][BOARD_SIZE - i - 1] == symbol for i in range(BOARD_SIZE)):
            return AI if symbol == ai_symbol else PLAYER
    # Check if the game is a tie
    return "T" if all(cell != EMPTY for row in board for cell in row) else None


def main():
    """Main function"""
    # Draw the initial board
    draw_board()
    # Keep playing until the game is over
    while True:
        # Get the player's move
        row, col = get_player_move()
        # Make the move
        board[row][col] = player_symbol
        # Check if the game is over
        result = check_result()
        if result == PLAYER:
            print("You win!")
            break
        elif result == "T":
            print("Tie!")
            break
        # Get the AI's move
        row, col = get_ai_move()
        # Make the move
        board[row][col] = ai_symbol
        # Draw the board
        draw_board()
        # Check if the game is over
        result = check_result()
        if result == AI:
            print("You lose!")
            break
        elif result == "T":
            print("Tie!")
            break


if __name__ == "__main__":
    main()
