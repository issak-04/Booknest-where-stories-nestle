const express = require('express')
const PORT = 4000
const cors = require('cors')
require('./db/config')
const multer = require('multer')

const Admin = require('./db/Admin/Admin')
const Users = require('./db/Users/userschema')
const Seller = require('./db/Seller/Sellers')
const Items = require('./db/Seller/Additem')
const MyOrders = require('./db/Users/myorders')
const WishlistItem = require('./db/Users/Wishlist')

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET', 'DELETE', 'PUT'],
    credentials: true,
  })
)

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage })
app.use('/uploads', express.static('uploads'))

// Root route
app.get('/', (req, res) => {
  res.send('Backend API is running ✅')
})

//
// Admin Routes
//

// Admin Login
app.post('/alogin', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await Admin.findOne({ email })
    if (!user) return res.json('no user')
    if (user.password !== password) return res.json('login fail')

    return res.json({
      Status: 'Success',
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    return res.status(500).json('Server error')
  }
})

// Admin Signup
app.post('/asignup', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existingUser = await Admin.findOne({ email })
    if (existingUser) return res.json('Already have an account')

    await Admin.create({ name, email, password })
    res.json('Account Created')
  } catch (err) {
    res.status(500).json('Failed to create account')
  }
})

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await Users.find()
    res.status(200).json(users)
  } catch {
    res.sendStatus(500)
  }
})

// Delete a user by id
app.delete('/userdelete/:id', async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete an order by id
app.delete('/userorderdelete/:id', async (req, res) => {
  try {
    await MyOrders.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete an item by id
app.delete('/useritemdelete/:id', async (req, res) => {
  try {
    await Items.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all sellers
app.get('/sellers', async (req, res) => {
  try {
    const sellers = await Seller.find()
    res.status(200).json(sellers)
  } catch {
    res.sendStatus(500)
  }
})

// Delete seller by id
app.delete('/sellerdelete/:id', async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await MyOrders.find()
    res.status(200).json(orders)
  } catch {
    res.sendStatus(500)
  }
})

//
// Seller Routes
//

// Seller login
app.post('/slogin', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await Seller.findOne({ email })
    if (!user) return res.json('no user')
    if (user.password !== password) return res.json('login fail')

    return res.json({
      Status: 'Success',
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch {
    res.status(500).json('Server error')
  }
})

// Seller signup
app.post('/ssignup', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existingUser = await Seller.findOne({ email })
    if (existingUser) return res.json('Already have an account')

    await Seller.create({ name, email, password })
    res.json('Account Created')
  } catch {
    res.status(500).json('Failed to create account')
  }
})

// Add item with image upload
app.post('/items', upload.single('itemImage'), async (req, res) => {
  const { title, author, genre, description, price, userId, userName } = req.body
  const itemImage = req.file?.path

  try {
    const item = new Items({
      itemImage,
      title,
      author,
      genre,
      description,
      price,
      userId,
      userName,
    })
    await item.save()
    res.status(201).json(item)
  } catch {
    res.status(400).json({ error: 'Failed to create item' })
  }
})

// Get items by userId
app.get('/getitem/:userId', async (req, res) => {
  try {
    const items = await Items.find({ userId: req.params.userId }).sort('position')
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

// Delete item by id
app.delete('/itemdelete/:id', async (req, res) => {
  try {
    await Items.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get seller's orders
app.get('/getsellerorders/:userId', async (req, res) => {
  try {
    const orders = await MyOrders.find({ sellerId: req.params.userId }).sort('position')
    res.json(orders)
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

//
// Users Routes
//

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await Users.findOne({ email })
    if (!user) return res.json('User not found')
    if (user.password !== password) return res.json('Invalid Password')

    return res.json({
      Status: 'Success',
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch {
    res.status(500).json('Server error')
  }
})

// User signup
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existingUser = await Users.findOne({ email })
    if (existingUser) return res.json('Already have an account')

    await Users.create({ name, email, password })
    res.json('Account Created')
  } catch {
    res.status(500).json('Failed to create account')
  }
})

// Get all items
app.get('/item', async (req, res) => {
  try {
    const items = await Items.find()
    res.json(items)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})

// Get single item by id
app.get('/item/:id', async (req, res) => {
  try {
    const item = await Items.findById(req.params.id)
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create new order
app.post('/userorder', async (req, res) => {
  const {
    flatno,
    city,
    state,
    pincode,
    totalamount,
    seller,
    sellerId,
    BookingDate,
    description,
    Delivery,
    userId,
    userName,
    booktitle,
    bookauthor,
    bookgenre,
    itemImage,
  } = req.body

  try {
    const order = new MyOrders({
      flatno,
      city,
      state,
      pincode,
      totalamount,
      seller,
      sellerId,
      BookingDate,
      description,
      userId,
      Delivery,
      userName,
      booktitle,
      bookauthor,
      bookgenre,
      itemImage,
    })
    await order.save()
    res.status(201).json(order)
  } catch {
    res.status(400).json({ error: 'Failed to create order' })
  }
})

// Get orders for a user
app.get('/getorders/:userId', async (req, res) => {
  try {
    const orders = await MyOrders.find({ userId: req.params.userId }).sort('position')
    res.json(orders)
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

//
// Wishlist Routes
//

// Get all wishlist items
app.get('/wishlist', async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find()
    res.json(wishlistItems)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})

// Get wishlist items for a user
app.get('/wishlist/:userId', async (req, res) => {
  try {
    const items = await WishlistItem.find({ userId: req.params.userId }).sort('position')
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch wishlist' })
  }
})

// Add item to wishlist
app.post('/wishlist/add', async (req, res) => {
  const { itemId, title, itemImage, userId, userName } = req.body

  try {
    const existingItem = await WishlistItem.findOne({ itemId })
    if (existingItem) return res.status(400).json({ msg: 'Item already in wishlist' })

    const newItem = new WishlistItem({ itemId, title, itemImage, userId, userName })
    await newItem.save()

    res.json(newItem)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})

// Remove item from wishlist
app.post('/wishlist/remove', async (req, res) => {
  const { itemId } = req.body

  try {
    await WishlistItem.findOneAndDelete({ itemId })
    res.json({ msg: 'Item removed from wishlist' })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
