import axios from 'axios'

let API_URL = "http://localhost:8080/api-book/";

const getBooks = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log(response.data);
        return response.data;
    } catch (error){
        throw error;
    }
}
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(API_URL + 'author/' + author);
        console.log(response.data);
        return response.data;
    } catch (error){
        throw error;
    }
}
const getBooksByName = async (name) => {
    try {
        const response = await axios.get(API_URL + 'name/' + name);
        console.log(response.data);
        return response.data;
    } catch (error){
        throw error;
    }
}
const save = async (book) => {
    try {
        const response = await fetch(API_URL, {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: book.name,
                author: book.author,
                publication: book.publication,
            })
        });
        if(response.ok){
            console.log("DATOS ENVIADOS CORRECTAMENTE")
        };
    } catch (error) {
        console.log("error save -> " + error)
    }
};
const update = async (book) => {
    try {
        const response = await fetch(API_URL, {
            method:"PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: book.id,
                name: book.name,
                author: book.author,
                publication: book.publication,
            })
        });
        if(response.ok){
            console.log("DATOS ENVIADOS CORRECTAMENTE")
        };
    } catch (error) {
        console.log("error update -> " + error)
    }
};
const deleteBook = async (id) => {
    try {
        const response = await axios.delete(API_URL + id)
        console.log(response.data);
    } catch (error) {
        
    }
}


export default {
    getBooks,
    save,
    getBooksByAuthor,
    getBooksByName,
    deleteBook,
    update
}