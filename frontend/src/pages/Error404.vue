<template>
  	<div id="notfound">
		<div class="notfound">
			<div class="notfound-404">
				<h1>4<span class="q-px-md"><img class="spinner" src="../../public/icons/lexicon07.png"/></span>4</h1>
			</div>
			<!-- <h2>the page you requested could not found</h2> -->
			<h2><b>OOPS! URL IS INCORRECT</b></h2>
			<q-btn @click="$router.go(-1)" flat class="notfound-search">
				<!-- content here -->
				<b>back</b>
			</q-btn>
		</div>
	</div>

</template>

<script >
export default {
  name: 'Error404'
}
</script>

<style>
#notfound {
  position: relative;
  height: 100vh;
  background: #f6f6f6;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
}

.notfound {
  max-width: 767px;
  width: 100%;
  line-height: 1.4;
  padding: 110px 40px;
  text-align: center;
  background: #fff;
  border-radius: 30px;
  -webkit-box-shadow: 0 15px 15px -10px rgba(0, 0, 0, 0.1);
          box-shadow: 0 15px 15px -10px rgba(0, 0, 0, 0.1);
}

.notfound .notfound-404 {
  position: relative;
  height: 180px;
}

.notfound .notfound-404 h1 {
  font-family: 'Roboto', sans-serif;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  font-size: 145px;
  font-weight: 700;
  margin: 0px;
  color: #262626;
  text-transform: uppercase;
}

.notfound .notfound-404 h1>span {
  color: #2F4C7E;
}

.notfound h2 {
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  font-weight: 400;
  text-transform: uppercase;
  color: #151515;
  margin-top: 0px;
  margin-bottom: 25px;
}

.notfound .notfound-search {
  position: relative;
 display: inline-block;
 padding: 5px 36px;
 margin: 10px 0;
 color: #fff;
 text-decoration: none;
 text-transform: uppercase;
 font-size: 18px;
 letter-spacing: 1px;
 border-radius: 30px;
 background: linear-gradient(90deg,#1760d1,#2f4c7e);
 transition: 0.5s;
 
}
.notfound .notfound-search:hover {
   padding: 7px 43px;
}

@media only screen and (max-width: 767px) {
  .notfound h2 {
    font-size: 18px;
  }
}

@media only screen and (max-width: 480px) {
  .notfound .notfound-404 h1 {
    font-size: 141px;
  }
}
 .spinner {
  width: 100px;
  height: 100px;
  animation: spin 2s infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>