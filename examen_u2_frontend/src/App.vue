
<script setup>
import Carousel from './components/CarouselComponent.vue';
</script>

<template>
  <div id="container" class="text-center">
    <Carousel />
    <div class="mt-4">
      <b-button @click="getBooksByAuthor()" class="me-2">Ordenar por autor</b-button>
      <b-button @click="getBooksByPublication()" class="me-2">Ordenar por fecha</b-button>
      <b-button @click="handleClick('Mostrar si tiene imagen')" >Mostrar si tiene imagen</b-button>
    </div>
    <b-card v-for="book in books" :key="book.id" class="movie-card m-3">
        <div class="d-flex justify-content-between align-items-center">
          <b-card-title>{{ book.name }}</b-card-title>
          <b-button
            variant="danger-outline"
            size="sm"
            @click="changeStatus(movie.id)"
          >
            <b-icon icon="x-circle" scale="1" variant="danger"></b-icon
          ></b-button>
        </div>
        <b-card-text>
          <strong>Nombre:</strong> {{ book.name }} <br />
          <strong>Autor:</strong> {{ book.author }} <br />
          <strong>publication:</strong> {{ book.publication }}<br />
        </b-card-text>
      </b-card>
  </div>

</template>
<script>
import BookServices from './utils/BookServices';
export default {
  data() {
    return{ 
      books: []
    }
  },
  created(){
    this.getBooks();
  },
  methods: {
    async getBooks(){
      try {
        const data = await BookServices.getBooks();
        console.log(data);
      this.books = data;
      } catch (error) {
        console.log("error getbooks")
      }
    },
    async getBooksByAuthor(){
      try {
        this.books = [];
        const data = await BookServices.getBooksByAuthor();
        this.books = data;
      }catch (error) {
        console.log("error getbooks")
      }
    },
    async getBooksByPublication(){
      try {
        this.books = [];
        const data = await BookServices.getBooksByPublication();
        this.books = data;
      }catch (error) {
        console.log("error getbooks")
      }
    }
  },
}
</script>
