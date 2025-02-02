# LevelDB REST API

A lightweight REST API built with Node.js and Express that provides CRUD operations on a **LevelDB** database. This API allows you to store, retrieve, delete, and manage key-value pairs efficiently.

## Features 🚀

- 🔑 **API Key Authentication** (via `x-api-key` header)
- 📄 **Get all keys** in the database
- 🔍 **Retrieve a single key-value pair**
- 💾 **Write (store) key-value pairs**
- ❌ **Delete a single key**
- 🔥 **Flush the database (delete all keys)**
- 📥 **Download all data as JSON**
- 📤 **Upload & Import JSON data into LevelDB**
- 🐳 **Docker support** for easy deployment

---

## Getting Started 🛠️

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/yourusername/leveldb-rest-api.git
cd leveldb-rest-api
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Run the Server**

```sh
API_KEY=my-secret-key node index.js
```

The API will start on port **6378**.

---

## Usage 📡

### **Authentication**

All requests require an **API key** in the `x-api-key` header.

```sh
-H "x-api-key: my-secret-key"
```

### **Endpoints**

#### 📌 **Get all keys**

```sh
curl -X GET "http://localhost:6378/keys" -H "x-api-key: my-secret-key"
```

#### 🔍 **Get a single key-value**

```sh
curl -X GET "http://localhost:6378/get/{key}" -H "x-api-key: my-secret-key"
```

#### 💾 **Store a key-value pair**

```sh
curl -X POST "http://localhost:6378/set" -H "Content-Type: application/json" -H "x-api-key: my-secret-key" -d '{"key":"username", "value":"Alice"}'
```

#### ❌ **Delete a key**

```sh
curl -X DELETE "http://localhost:6378/delete/{key}" -H "x-api-key: my-secret-key"
```

#### 🔥 **Flush (Delete all keys)**

```sh
curl -X DELETE "http://localhost:6378/flush" -H "x-api-key: my-secret-key"
```

#### 📥 **Download entire database as JSON**

```sh
curl -O http://localhost:6378/download -H "x-api-key: my-secret-key"
```

#### 📤 **Upload (Import) JSON data into LevelDB**

```sh
curl -X POST "http://localhost:6378/upload" -F "file=@database.json" -H "x-api-key: my-secret-key"
```

---

## Docker Support 🐳

### **Run with Docker**

```sh
docker build -t leveldb-server .
docker run -d -p 6378:6378 -v $(pwd)/data:/data -e API_KEY=my-secret-key --name leveldb-server leveldb-server
```

### **Run with Docker Compose**

Create a `docker-compose.yml` file:

```yaml
version: "3.8"
services:
  leveldb:
    container_name: leveldb-server
    build: .
    ports:
      - "6378:6378"
    volumes:
      - ./data:/data
    environment:
      API_KEY: "my-secret-key"
    restart: always
```

Run:

```sh
docker-compose up -d
```

---

## Environment Variables 🌍

| Variable  | Description                                |
| --------- | ------------------------------------------ |
| `API_KEY` | The secret key required for authentication |

---

## LevelDB Documentation 📖

For more details on LevelDB, visit the official documentation:
🔗 [LevelDB GitHub](https://github.com/google/leveldb)

---

## License 📝

This project is licensed under the MIT License.

---

## Contributing 🤝

Feel free to open **issues** and **pull requests** to contribute.
