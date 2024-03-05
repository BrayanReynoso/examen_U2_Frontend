<script setup>
import CarouselComponent from "./components/CarouselComponent.vue";
</script>

<template>
  <div id="container" class="text-center">
    <CarouselComponent />
    <div class="d-flex">
      <div class="left-panel">
        <div class="mt-4">
          <b-button @click="getBooks()" class="me-2">Todos los libros</b-button>
          <b-button @click="getBooksByAuthor()" class="me-2">Ordenar por autor</b-button>
          <b-button @click="getBooksByPublication()" class="me-2">Ordenar por fecha</b-button>
          <b-button @click="handleClick('Mostrar si tiene imagen')">Mostrar si tiene imagen</b-button>
        </div>
        <b-button variant="primary" @click="showModal = true" class="mt-3 mb-2">Agregar</b-button>

        <b-card v-for="book in books" :key="book.id" class="movie-card m-3" draggable
          @dragstart="onDragStart($event, book)">
          <div class="d-flex justify-content-between align-items-center">
            <b-card-title>{{ book.name }}</b-card-title>
          </div>
          <b-card-text>
            <div class="img-container">
              <img style="object-fit: cover; height: 100%" class="d-block w-100" :src="book.images[0].url"
                alt="Image" />
              <strong>Nombre:</strong> {{ book.name }} <br />
              <strong>Autor:</strong> {{ book.author }} <br />
              <strong>publication:</strong> {{ book.publication }}<br />
            </div>
          </b-card-text>
        </b-card>
      </div>

      <div class="right-panel">
        <!-- drop para eliminar -->
        <div style="background-color: brown;" class="drag-box" @dragover.prevent @drop="onDropDelete($event)"
          :class="{ 'delete-drop': action === 'eliminar' }">
          Eliminar
        </div>
        <!-- drop para editar -->
        <div style="background-color:yellow;" class="drag-box" @dragover.prevent @drop="onDropEdit($event)"
          :class="{ 'edit-drop': action === 'editar' }">
          Editar
        </div>
      </div>
    </div>

    <!-- Modal para actualizar libro -->
    <b-modal v-model="showUpdateModal" title="Actualizar Libro">
      <b-form @submit.prevent="updateBook">
        <b-form-group label="Nombre:" label-for="update-name" label-text-color="black">
          <b-form-input v-model="selectedBook.name" id="update-name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Autor:" label-for="update-author" label-text-color="black">
          <b-form-input v-model="selectedBook.author" id="update-author" required></b-form-input>
        </b-form-group>
        <b-form-group label="Fecha publicación:" label-for="update-publication" label-text-color="black">
          <b-form-input v-model="selectedBook.publication" id="update-publication" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">Actualizar</b-button>
      </b-form>
    </b-modal>
    <b-modal v-model="showModal" title="Agregar Libro" @Hidden="resetForm">
      <b-form @submit.prevent="addBook">
        <b-form-group label="Nombre:" label-for="name">
          <b-form-input v-model="newBook.name" id="name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Autor:" label-for="author">
          <b-form-input v-model="newBook.author" id="author" required></b-form-input>
        </b-form-group>
        <b-form-group label="Fecha publicación:" label-for="publication">
          <b-form-input v-model="newBook.publication" id="publication" required></b-form-input>
        </b-form-group>
        <div>
          <input type="file" accept="image/*" @change="handleFileInputChange" />
        </div>
        <b-button type="submit" variant="success">Guardar</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import BookServices from "./utils/BookServices";
export default {
  data() {
    return {
      books: [],
      showModal: false,
      showUpdateModal: false,
      selectedBook: {
        id: null,
        name: "",
        author: "",
        publication: "",
      },
      imageObjects: [],
      newBook: {
        name: "",
        author: "",
        publication: "",
      },
      action: null,
    };
  },
  created() {
    this.getBooks();
  },
  methods: {
    handleFileInputChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const newImages = Array.from(files).map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result.split(',')[1];
              resolve({ mimeType: file.type, fileBase64: base64String });
            };
            reader.readAsDataURL(file);
          });
        });

        Promise.all(newImages).then((results) => {
          this.imageObjects = [...this.imageObjects, ...results];
        });
      }
    },
    async getBooks() {
      this.books = [];
      try {
        const data = await BookServices.getBooks();
        console.log(data);
        this.books = data;
      } catch (error) {
        console.log("error getbooks");
      }
    },
    resetForm() {
      this.newBook = {
        name: "",
        author: "",
        publication: "",
      };
    },
    async getBooksByAuthor() {
      this.books = [];
      try {
        const data = await BookServices.getBooksByAuthor();
        this.books = data;
      } catch (error) {
        console.log("error getbooks");
      }
    },
    async getBooksByPublication() {
      this.books = [];
      try {
        const data = await BookServices.getBooksByPublication();
        this.books = data;
      } catch (error) {
        console.log("error getbooks");
      }
    },

    async addBook() {
      try {
        const response = await BookServices.save(this.newBook, this.imageObjects);
        this.showModal = false;
        this.resetForm();
        await this.getBooks();
      } catch (error) {
        console.error("Error al agregar la libro:", error);
      }
    },
    async deleteBook(bookId) {
      try {
        await BookServices.deleteBook(bookId);
        await this.getBooks();
      } catch (error) {
        console.error("Error al eliminar el libro:", error);
      }
    },
    async updateBook() {
      try {
        await BookServices.updateBook(this.selectedBook.id, this.selectedBook);
        this.showUpdateModal = false;
        await this.getBooks();
      } catch (error) {
        console.error("Error al actualizar el libro:", error);
      }
    },

    onDragStart(event, book) {
      event.dataTransfer.setData("bookId", book.id);
    },
    onDropDelete(event) {
      const bookId = event.dataTransfer.getData("bookId");
      this.action = 'eliminar';
      this.deleteBook(bookId);
    },
    onDropEdit(event) {
      const bookId = event.dataTransfer.getData("bookId");
      this.action = 'editar';
      this.selectedBook = this.books.find(book => book.id === parseInt(bookId));
      this.showUpdateModal = true;
    },

  },
};
</script>

<style>
.left-panel {
  flex: 1;
}

.right-panel {
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.drag-box {
  width: 100%;
  height: 200px;
  background-color: lightgray;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}

.delete-drop {
  background-color: red;
}

.edit-drop {
  background-color: yellow;
}
</style>

</style>
