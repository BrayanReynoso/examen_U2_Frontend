<script setup>
import Carousel from "./components/CarouselComponent.vue";
</script>

<template>
  <div id="container" class="text-center">
    <Carousel />
    <div class="mt-4">
      <b-button @click="getBooks()" class="me-2">Todos los libros</b-button>
      <b-button @click="getBooksByAuthor()" class="me-2">Ordenar por autor</b-button>
      <b-button @click="getBooksByPublication()" class="me-2">Ordenar por fecha</b-button>
      <b-button @click="handleClick('Mostrar si tiene imagen')">Mostrar si tiene imagen</b-button>
    </div>
    <b-button variant="primary" @click="showModal = true" class="mt-3 mb-2 align-self-end">Agregar</b-button>
    <b-card v-for="book in books" :key="book.id" class="movie-card m-3">
      <div class="d-flex justify-content-between align-items-center">
        <b-card-title>{{ book.name }}</b-card-title>
        <b-button variant="danger-outline" size="sm" @click="changeStatus(movie.id)">
          <b-icon icon="x-circle" scale="1" variant="danger"></b-icon></b-button>
      </div>
      <b-card-text>
    <div class="img-container">
      <img
        style="object-fit: cover; height: 100%"
        class="d-block w-100"
        :src="book.images[0].url"
        alt="Image"
      />
      <strong>Nombre:</strong> {{ book.name }} <br />
      <strong>Autor:</strong> {{ book.author }} <br />
      <strong>publication:</strong> {{ book.publication }}<br />
    </div>
  </b-card-text>
    </b-card>
    <b-modal v-model="showModal" title="Agregar Libro" @Hidden="resetForm">
      <b-form @submit.prevent="addBook">
        <b-form-group label="Nombre:" label-for="name" style="color: black;">
          <b-form-input v-model="newBook.name" id="name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Autor:" label-for="author" style="color: black;">
          <b-form-input v-model="newBook.author" id="author" required></b-form-input>
        </b-form-group>
        <b-form-group label="Fecha publicación:" style="color: black;" label-for="publication">
          <b-form-input v-model="newBook.publication" id="publication" required></b-form-input>
        </b-form-group>
        <div>
          <input type="file" accept="image/*" @change="handleFileInputChange"  />
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
      imageObjects: [],
      newBook: {
        name: "",
        author: "",
        publication: "",
      },
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
    }
  },
};
</script>
