<template>
   <q-page class="flex flex-center">
    <div class="q-pa-sm" style="max-width: 315px">
        <div>
         <img class="spinner" style="margin-left: 130px" src="../../public/icons/lexicon07.png"/>
        </div>

            <br><br>

        <div>
         <img class="responsive" style="margin-left: 0;" src="../../public/icons/lexicon08.png"/>
        </div>
        
        <p style="text-align: center; margin-top: 100px; color: #1976D2">Version 1.0</p>
    </div>
   </q-page>
</template>

<style>
.spinner {
  width: 50px;
  height: 50px;
  -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
  animation: sk-rotateplane 1.2s infinite ease-in-out;
}

@-webkit-keyframes sk-rotateplane {
  0% { -webkit-transform: perspective(120px) }
  50% { -webkit-transform: perspective(120px) rotateY(180deg) }
  100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }
}

@keyframes sk-rotateplane {
  0% { 
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg) 
  } 50% { 
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg) 
  } 100% { 
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}
</style>