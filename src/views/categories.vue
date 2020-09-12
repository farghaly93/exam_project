<template>
	<!DOCTYPE html>
	<html lang="zxx" class="no-js">
		<body>
				<nav class="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
					<div class="container">
						<a class="navbar-brand" href="#">Deutsch lehrer</a>
						<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
							<span class="navbar-toggler-icon"></span>
							</button>
						<div class="collapse navbar-collapse" id="navbarResponsive">
						<ul class="navbar-nav ml-auto">
							<li class="nav-item active">
							<a class="nav-link" href="#home">ابدأ
									<span class="sr-only">(current)</span>
								</a>
							</li>
							<li class="nav-item">
							<a class="nav-link" href="#students">الطلاب</a>
							</li>
							<li class="nav-item">
							<a class="nav-link" href="#weoffer">التواصل الاجتماعي</a>
							</li>
							<li class="nav-item">
							<a class="nav-link" href="#about">معلومات</a>
							</li>
							<li class="nav-item">
							<a class="nav-link" href="#contact">ارسال ايميل</a>
							</li>
							
						</ul>
						</div>
					</div>
				</nav>
				<header class="masthead" id="home">
					<div class="container h-100">
						<div class="row h-100 align-items-center">
						<div class="col-12 text-right">
							<p class="lead">{{adminData.name}}</p>
							<h1 style="margin-bottom:10px;" class="font-weight-light">{{adminData.siteName}}</h1>
							<p class="lead">0{{adminData.phone}}</p>
							<p class="lead">{{adminData.address}}</p>
							<p class="lead">{{adminData.career}}</p>
							<br><br>
							<a style="text-align:center;font-size:27px;" @click="()=>{$router.push('/exam')}" class="primary-btn header-btn text-uppercase">ابدأ الان</a>
						</div>
						</div>
					</div>
				</header>	
			







			<section style="text-align:center;" id="students" class="facts-area section-gap">
				<div class="container">
					<div class="row">
						<div class="col counter">
								<i class="fa fa-user fa-2x"></i>
								<h1 style="-webkit-text-fill-color:#115668db" class="counter">{{one}}</h1>
								<p class="count-text ">طلاب الصف الأول الثانوي</p>
							</div>
							<div class="col counter">
								<i class="fa fa-user fa-2x"></i>
								<h1 style="-webkit-text-fill-color:#115668db" class="counter">{{two}}</h1>
								<p class="count-text ">طلاب الصف الثاني الثانوي</p>
							</div>
							<div class="col counter">
								<i class="fa fa-user fa-2x"></i>
								<h1 style="-webkit-text-fill-color:#115668db" class="counter">{{three}}</h1>
								<p class="count-text ">طلاب الصف الثالث الثانوي</p>
							</div>										
					</div>
				</div>	
			</section>
			<!-- end fact Area -->





			
			<!-- Start info Area -->
			<section class="info-area" id="about">
				<div class="container-fluid">
					<div class="row d-flex justify-content-end align-items-center">
						<div class="col-lg-6 col-md-12 info-left no-padding">
							<img class="img-fluid" src="../img/info-img.jpg" alt="">
						</div>
						<div class="col-lg-6 col-md-12 info-right no-padding">
							<h1>مده الامتحان ساعة واحدة <br>
							لا يمكن اعادة الامتحان</h1>
							<p>
								مدرس لغة ألمانية للمرحلة الثانوية فى اسيوط ، فكر جديد فى التدريس وتدريب على السياسة الجديدة لوزارة التربية والتعليم من خلال التعليم المدمج والذي يجمع بين الشرح وحل التدريبات على الانترنت حيث سيكون هناك اختبارات على موقع خاص بالمدرس يتمكن الطالب من خلاله على التدرب وحل امتحانات على كل درس بعد شرحه ويتمكن ولى الأمر من متابعه درجات ابنه على هذا الموقع .
								المدرس على استعداد لإعطاء دروس برايفت ( خاص) فى منزل الطالب
								للتواصل للحجز والاستفسار
								الأستاذ طه يوسف
							</p>
							
							<p>واتس 01012996733</p>
							<p>موبايل 01005010189</p>
							<p>صورة من غلاف المذكرات</p>
						</div>						
					</div>
				</div>	
			</section>

			<!-- start contact Area -->	






			
			<!-- End feature Area -->

			<!-- Start offered Area -->
			<section class="offered-area" id="weoffer">
				<div class="container">
					<div class="menu-content pb-60 col-lg-8">
						<div style="text-align:center;" class="title text-center">
							<h1 class="mb-10 "></h1>
						</div>
					</div>					
					<div style="margin-left:auto;margin-right:auto;" class="row social align-items-center justify-content-start">
						<div class="col-lg-12 offered-left">
							<div class="offer-wrap flex-row d-flex row">
								<div class="col-4">
									<div style="background-color:rgb(35, 80, 228);border-radius:30px;" class="single-offer mb-30">
										<a target="_blank" :href="adminData.facebook"><i style="color:#fff;font-size:50px;" class="fa fa-facebook"></i></a>
									</div> 
								</div>
								<div class="col-4">
									<div style="background-color:rgb(228, 35, 61);border-radius:30px;" class="single-offer mb-30">
										<a href="#"></a><i style="color:#fff;font-size:50px;" class="fa fa-google"></i>
									</div> 
								</div>
								<div class="col-4">
									<div style="background-color:rgb(35, 215, 228);border-radius:30px;" class="single-offer mb-30">
										<a href="#"></a><i style="color:#fff;font-size:50px;" class="fa fa-twitter"></i>
									</div> 
								</div>								
							</div>																	
						</div>
					</div>
				</div>	
			</section>
			<!-- End offered Area -->



	
			<section class="contact-area section-gap" id="contact">
				<div class="container">
					<div class="row d-flex justify-content-center">
						<div class="menu-content pb-30 col-lg-8">
							<div class="title text-center">
								<h1 class="mb-10">للتوااصل عبر الايميل فورا</h1>
								<p>قم بادخال بياناتك صحيحة وقم بارسال بريد الكتروني فوري للاستاذ طه يوسف</p>
							</div>
						</div>
					</div>										
					<form ref="form" @submit.prevent="sendEmail" class="form-area mt-60 contact-form text-right" id="myForm">
						<div class="row">	
							<div style="margin-top:40px;" class="col-lg-6 form-group">
								<input style="padding:22px;" name="name" placeholder="Enter your name" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter your name'" class="common-input mb-20 form-control" required="" type="text">
								<input style="padding:22px;" name="subject" placeholder="Enter your subject" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter your subject'" class="common-input mb-20 form-control" required="" type="text">
							</div>
							<div class="col-lg-6 form-group">
								<textarea class="common-textarea mt-10 form-control" name="message" placeholder="Messege" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Messege'" required=""></textarea>
								<button style="float:left;" class="primary-btn mt-20">Send Message<span class="fa fa-arrow-right"></span></button>
								<app-loading v-if="emailLoading"/>
							</div>
						</div>
					</form>						
					
				</div>	
			</section>
			<br><br><br><br><br>
			<!-- Footer -->
<footer class="page-footer font-small indigo">

  <!-- Footer Links -->
  <div class="container">

    <!-- Grid row-->
    <div class="row text-center d-flex justify-content-center pt-5 mb-3">

      <!-- Grid column -->
      <div class="col-md-2 mb-3">
        <h6 class="text-uppercase font-weight-bold">
          <a href="#!">About us</a>
        </h6>
      </div>
      <!-- Grid column -->

      <!-- Grid column -->
      <div class="col-md-2 mb-3">
        <h6 class="text-uppercase font-weight-bold">
          <a href="#!">Products</a>
        </h6>
      </div>
      <!-- Grid column -->

      <!-- Grid column -->
      <div class="col-md-2 mb-3">
        <h6 class="text-uppercase font-weight-bold">
          <a href="#!">Awards</a>
        </h6>
      </div>
      <!-- Grid column -->

      <!-- Grid column -->
      <div class="col-md-2 mb-3">
        <h6 class="text-uppercase font-weight-bold">
          <a href="#!">Help</a>
        </h6>
      </div>
      <!-- Grid column -->

      <!-- Grid column -->
      <div class="col-md-2 mb-3">
        <h6 class="text-uppercase font-weight-bold">
          <a href="#!">Contact</a>
        </h6>
      </div>
      <!-- Grid column -->

    </div>
    <!-- Grid row-->
    <hr class="rgba-white-light" style="margin: 0 15%;">

    <!-- Grid row-->
    <div class="row d-flex text-center justify-content-center mb-md-0 mb-4">

      <!-- Grid column -->
      <div class="col-md-8 col-12 mt-5">
        <p style="line-height: 1.7rem">Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo.
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.</p>
      </div>
      <!-- Grid column -->

    </div>
    <!-- Grid row-->
    <hr class="clearfix d-md-none rgba-white-light" style="margin: 10% 15% 5%;">

    <!-- Grid row-->
    <div class="row pb-3">

      <!-- Grid column -->
      <div class="col-md-12">

        <div class="mb-5 flex-center">

          <!-- Facebook -->
          <a class="fb-ic">
            <i class="fab fa-facebook-f fa-lg white-text mr-4"> </i>
          </a>
          <!-- Twitter -->
          <a class="tw-ic">
            <i class="fab fa-twitter fa-lg white-text mr-4"> </i>
          </a>
          <!-- Google +-->
          <a class="gplus-ic">
            <i class="fab fa-google-plus-g fa-lg white-text mr-4"> </i>
          </a>
          <!--Linkedin -->
          <a class="li-ic">
            <i class="fab fa-linkedin-in fa-lg white-text mr-4"> </i>
          </a>
          <!--Instagram-->
          <a class="ins-ic">
            <i class="fab fa-instagram fa-lg white-text mr-4"> </i>
          </a>
          <!--Pinterest-->
          <a class="pin-ic">
            <i class="fab fa-pinterest fa-lg white-text"> </i>
          </a>

        </div>

      </div>
      <!-- Grid column -->

    </div>
    <!-- Grid row-->

  </div>
  <!-- Footer Links -->

  <!-- Copyright -->
  <div class="footer-copyright text-center py-3">© 2020 Copyright:
    <a href="https://mdbootstrap.com/"> MDBootstrap.com</a>
  </div>
  <!-- Copyright -->

</footer>
<!-- Footer -->
			<app-whatsapp/>
		</body>
	</html>




</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import whatsappVue from '../components/whatsapp.vue';
import Loading from '../components/loading.vue';
export default {
    mounted() {
		$(document).ready(function(){
            $("a").on('click', function(event) {

                if (this.hash !== "") {
                event.preventDefault();

                var hash = this.hash;

                $('html').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function(){
            
                    window.location.hash = hash;
                });
                } // End if
            });
		});
		
        const one = axios.get('/getStudentsNumbers/one');
        const two = axios.get('/getStudentsNumbers/two');
        const three = axios.get('/getStudentsNumbers/three');
        axios.all([one, two, three]).then(axios.spread((...requests) => {
            const onee = requests[0].data.users;
            const twoo = requests[1].data.users;
			const threee = requests[2].data.users;
			
			const increase1 = setInterval(()=> {
				if(this.one !== onee) {
					clearInterval(increase1);
					++this.one;
				}
			}, 50);
			const increase2 = setInterval(()=> {
				if(this.two !== twoo) {
					clearInterval(increase2);
					++this.two;
				}
			}, 50);
			const increase3 = setInterval(()=> {
				if(this.three !== threee) {
					clearInterval(increase3);
					++this.three;
				}
			}, 50);
            })
        );
},
    computed: {
            adminData(){
                return this.$store.getters.adminData;
            },
            message(){
                return this.$store.getters.message;
            }
    },
    data() {
        return {
            one: 0,
            two: 0,
			three: 0,
			fill: false,
			emailLoading: false
        }
	},
	methods: {
		sendEmail() {
			this.emailLoading = true;
			window.location.href = "mailto:"+this.adminData.gmail+"?subject="+this.$refs.form.subject.value+"&body="+this.$refs.form.message.value;
			this.emailLoading = false;
		}
	},
    components: {
		appWhatsapp: whatsappVue,
		appLoading: Loading
    }
}
</script>

<style scoped lang="scss">
    /* @import url('../scss/mainPage/bootstrap.css'); */
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet');
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=swap" rel="stylesheet');
	@import url('../scss/mainPage/magnific-popup.css');
    @import url('../scss/mainPage/nice-select.css');
    @import url('../scss/mainPage/animate.min.css');
    @import url('../scss/mainPage/owl.carousel.css');
	@import url('../scss/mainPage/main.css');
	.counter {
    background-color:#f5f5f5;
    padding: 20px 0;
    border-radius: 25px;
	margin: 10px;
}

.count-title {
    font-size: 40px;
    font-weight: normal;
    margin-top: 10px;
    margin-bottom: 0;
    text-align: center;
}

.count-text {
    font-size: 13px;
    font-weight: normal;
    margin-top: 10px;
    margin-bottom: 0;
    text-align: center;
}

.fa-2x {
    margin: 0 auto;
    float: none;
    display: table;
    color: #4ad1e5;
}
		.banner-area{
			background:url(../img/header-bg.jpg) center;
			background-size:cover
			}
		@media (max-width: 767.98px){
			.banner-area .fullscreen{height:700px !important
			}
		}
		@media (max-width: 767.98px){
			.image {
				height: 60%;
			}
			.social {
				width:85%;
			}
		}
		@media (min-width: 767.98px){
			.social {
				width:60%;
			}
		}
		.banner-area .overlay{
			background:#222;opacity:.9
		}.banner-area .primary-btn{
			padding-left:30px;padding-right:30px
			}
		.banner-content{
			text-align:left
		}
		.banner-content h1{
			font-size:60px;
			font-weight:700;
			line-height:1em;
			margin-top:20px
			}
		.banner-content h1 span{
			font-weight:700
			}
		@media (max-width: 991.98px){
			.banner-content h1{
				font-size:36px}
				}
		@media (max-width: 991.98px){
			.banner-content h1 br{
				display:none
				}
		}
		@media (max-width: 1199.98px){
			.banner-content h1{font-size:45px}
			}
		@media (max-width: 414px){
			.banner-content h1{font-size:40px}
			}
		.banner-content h4{
			font-weight:400;
			letter-spacing:3px
			}
		.banner-content p{
			padding:20px 0px
			}
		.header-btn{
			border:1px solid transparent;
			color:#fff
			}
		.header-btn:hover{
			border:1px solid #222;
			background:transparent;
			color:#222
			}
		.masthead {
			height: 100vh;
			min-height: 500px;
			background-image: url('../img/header-bg4.png');
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			.text-center {

			}
			p {
				font-size: 30px;
				color: rgba(39, 39, 41, 0.76);
				font-weight: bolder;
				text-shadow: 2px 2px 4px  rgb(39, 37, 37);
			}
			a {
				width: 30%;
			}
		}
		.font-weight-light {
			color: rgb(39, 39, 41);
			font-size: 70px;
			font-weight: bolder;
			text-shadow: 3px 3px 3px  rgb(255, 255, 255);
		}
		@media (max-width: 1000px) {
			.font-weight-light {
				font-size: 50px;
			}
			.masthead {
				margin-top: 80px;
				background-image: url('../img/header-bg5.png');
				.text-right {
					background-color: rgba(255, 255, 255, 0.651);
				}
				a {
					width: 60%
				}
			}
		}
</style>