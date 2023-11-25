
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const mariadb = require('mariadb');
const fs = require('fs');

const port = 3001;
const dataFolderPath = path.join(__dirname);

app.use(cors());
app.use(express.json());

const verificacion = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Error de verificación' });
  }

  try {
    const verificacionUser = jwt.verify(token, 'secretKey');
    req.usuario = verificacionUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Verificación incorrecta' });
  }
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({ message: 'Deben completarse ambos campos' });
  }
 else {
  const token = jwt.sign({ username, password }, 'secretKey', { expiresIn: '1h' });

  res.status(200).json({ token });
 }
});

app.post('/cart/:id', verificacion, (req, res) => {
  const cartId = req.params.id;
  const filePath = path.join(dataFolderPath, "cart", `${cartId}.json`);
  const cartItem = req.body.product;
  
  if (!cartItem) {
    return res.status(400).json({ message: 'Item incorrecto' });
  }

  try {
  
    const cart = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      : [];

    cart.push(cartItem);

    fs.writeFileSync(filePath, JSON.stringify(cart));

    res.status(200).json({ message: 'Item añadido' });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ message: 'Error' });
  }
});


app.get("/cart/:id", verificacion, (req,res) => {
  const cartId = req.params.id;
  const filePath = path.join(dataFolderPath, "cart", `${cartId}.json`);
  res.sendFile(filePath);
})



app.get("/cats",  (req, res) => {
  const filePath = path.join(dataFolderPath, "cats", "cat.json");
  res.sendFile(filePath)
});

app.get("/cats_products/:id", (req,res) => {
  const cats_productsId = req.params.id;
  const filePath = path.join(dataFolderPath, "cats_products", `${cats_productsId}.json`);
  res.sendFile(filePath);
})


app.get("/products/:id", (req,res) => {
  const productsId = req.params.id;
  const filePath = path.join(dataFolderPath, "products", `${productsId}.json`);
  res.sendFile(filePath);
})

app.get("/products", (req,res) => {
  const productsId = req.params.id;
  const filePath = path.join(dataFolderPath, "products", `${productsId}.json`);
  res.sendFile(filePath);
})

app.get("/products_comments/:id", (req,res) => {
  const products_commentsId = req.params.id;
  const filePath = path.join(dataFolderPath, "products_comments", `${products_commentsId}.json`);
  res.sendFile(filePath); 
})

app.get("/sell/:id", (req,res) => {
  const sellId = req.params.id;
  const filePath = path.join(dataFolderPath, "sell", `${sellId}.json`);
  res.sendFile(filePath);
})

app.get("/user_cart/:id", verificacion, (req,res) => {
  const user_cartId = req.params.id;
  const filePath = path.join(dataFolderPath, "user_cart", `${user_cartId}.json`);
  res.sendFile(filePath);
})

app.listen(port, () => {
  console.log("Server running on port " + `${port}`);
});