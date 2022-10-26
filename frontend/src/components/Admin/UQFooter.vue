=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================
 
 <template>
  <div style="z-index: -10">
    <br />
    <br />
    <br />
    <q-footer elevated class="bg-default text-white footer">
      <q-toolbar>
        <q-toolbar-title id="footer-container" style="padding: 40px 100px;">
          <div class="row q-gutter-xl justify-center font-monseratt" style="font-size:14px;">
            <div>
              <a href="#" class="nav-tab">Contact Us</a>
            </div>
            <div>
              <a href="#" class="nav-tab">News</a>
            </div>
            <div>
              <a href="#" class="nav-tab">FAQs</a>
            </div>
            <div>
              <a href="#" class="nav-tab">More Services</a>
            </div>
            <div>
              <a href="#" class="nav-tab">Hedge Fund Information</a>
            </div>
            <div>
              <a href="#" class="nav-tab">Privacy Statement</a>
            </div>
            <div>
              <a href="#" class="nav-tab">Terms and Conditions</a>
            </div>
          </div>

          <div class="row q-mt-md font-monseratt" align="center" style="font-size:14px;">
            <div class="col-12">
              Lexicon Bank is a proud member of
              <q-icon size="40px" class="q-ml-sm" name="img:app-icon/credit-card-visa.png" />
            </div>
            <div class="col-12">You can download our Lexicon Bank mobile application at:</div>
            <div class="col-12" align="center">
              <a href="https://www.apple.com/ios/app-store/" target="_blank">
                <q-icon size="50px" class="q-mt-sm cursor-pointer" name="img:app-icon/app.png" />
              </a>
              <a href="https://play.google.com/store/apps" target="_blank">
                <q-icon size="50px" class="q-mt-sm q-ml-sm" name="img:app-icon/playstore.png" />
              </a>
            </div>
          </div>
          <div style=" font-size:12px; " class="q-mt-lg font-monseratt" align="center">
            <div class="col-12">Deposits are insured by Lexicon bank up to $200,000.00 per client</div>
            <div
              class="col-12"
            >For concerns, feel free to contact us at (202)-777-6099 or message your concerns at lexicon@holdings</div>
            <div class="col-12">All rights reserved to Lexicon Bank &copy;2020</div>
          </div>

          <div style=" font-size:10px; " class="q-mt-md font-monseratt" align="center">
            <div
              class="col-12"
            >Lexicon Bank is an online multi-currency savings and hedge fund investment platform, the platform is made for the connection of individuals’ all throughout</div>
            <div
              class="col-12"
            >the world. Any transaction made within Lexicon Bank does not implicate the platform itself, all users are given anonymity and the platform does not encourage</div>
            <div class="col-12">any arrangements with any illegal intentions.</div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  async mounted() {},
};
</script>
<style>
.menu-footer {
  position: absolute;
  bottom: 1;
  padding: 5rem 0;
  width: 100%;
}
a.nav-tab {
  color: white;
  text-decoration: none;
  cursor: pointer !important;
}
.footer {
  z-index: 0;
}
@media (max-width: 1024px) {
  #footer-container {
    padding: 20px 0 !important;
  }
}
</style>

