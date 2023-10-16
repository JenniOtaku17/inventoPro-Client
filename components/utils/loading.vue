<template>
    <v-container class="loadingContainer">
        <div class='ballLoading bounceLoading'></div>
        <div class='ballLoading bounceLoading '></div>
        <div class='ballLoading bounceLoading'></div> 
    </v-container>
  </template>
  
  <script>
  
  export default {
    data () {
      return {
      
      }
    },
    mounted(){
      
    },
    methods: {
    
    }
  }
  </script>
  <style>

  .loadingContainer{
    display: flex;
    height: 75vh;
    align-items: center;
    justify-content: center;
  }

    .ballLoading {
        position: relative;
        margin-left:10px;
        margin-right:10px;
        width:5vmin;
        height:5vmin;
        border-radius:50%;
        background:#24A645;
        animation: bounce 1s infinite;
        animation-timing-function: ease;
        animation-direction: alternate;
    }

    .bounceLoading:nth-child(1) {
        animation-delay:-200ms;
    }
    .bounceLoading:nth-child(2) {
        animation-delay: -300ms;
    }
    .bounceLoading:nth-child(3) {
        animation-delay: -400ms;
    }


    @keyframes bounce {
        from {
            transform: translateY(30px);
            background: #24A645;
        }
        to {
            transform: translateY(-30px);
            background:#0A3114;
        }
    }
  
    
  
  </style>