// // email (string): The email address of the customer.
// product (ObjectId): The stationery product ordered. (unused ref) (enter the created productId from your database which product you would love to buy).
// quantity (number): The quantity of the ordered product.
// totalPrice (number): The total price (product price * quantity).

export type IOrder = {
    email: string,
    product: string,
    quantity: number,
    totalPrice: number,

}