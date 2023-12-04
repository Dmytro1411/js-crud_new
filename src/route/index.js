// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// Для сохранения данных, которые нам приходят с фронтенда, создаем код, который будет нам сохранять необходимые данные прямо в середине сервера
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  //Чтобы задействовать пароль пишем следующий код
  verifyPassword = (password) => this.password === password

  // Создаем статичный метод, который будет принимать уже созданногог user и сохранять в частную переменную #list
  static add = (user) => {
    //Так как #list это массив, то да добавления туда данных мы используем код
    this.#list.push(user)
  }

  static getList = () => this.#list

  // Для нахождения пользователя по id

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    let user = this.getById(id)

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user', function (req, res) {
  // res.render генерує нам HTML сторінку
  let list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  // Свойство body которое содержит все данные, которые мы отправляем
  let { email, login, password } = req.body

  let user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Пользователь создан',
  })
})

// ================================================================
// Создаем эндпоинт для страницы удаления пользователя

router.get('/user-delete', function (req, res) {
  let { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Пользователь удален',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  let { email, password, id } = req.body

  let result = false

  let user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email почта обновлена'
      : 'Произошла ошибка',
  })
})

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = new Date().getTime()
  }

  verifyId = (id) => this.id === id

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static editById = (id, data) => {
    let product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static edit = (product, { name, price, description }) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }
}
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  let list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })

  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  //   console.log(req.body)
  // Через деструктаризацию достаем name, price, description
  let { name, price, description } = req.body

  // Создаем новый продукт
  let product = new Product(name, price, description)

  // Куда передаем необходимые данные
  Product.add(product)

  //Смотрим что у нас в массиве
  //   console.log(Product.getList())

  res.render('product-alert', {
    style: 'product-alert',
    info: 'Товар успешно добавлен',
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  let { id } = req.query

  let list = Product.getList(Number(id))

  //   console.log(list)

  res.render('product-edit', {
    style: 'product-edit',
    data: {
      products: {
        list,
        // isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-edit', function (req, res) {
  let { name, price, description, id } = req.body

  let result = false

  let product = Product.getById(Number(id))

  if (product.verifyId(id)) {
    Product.edit(product, { name, price, description })
    result = true
  }

  res.render('product-edit', {
    style: 'product-edit',
    info: result
      ? 'Товар успешно обнавлен'
      : 'Произошла ошибка',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  let list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
