<template>
	<div class="login-page">
		<div class="login">
			<div class="login-container">
				<div class="login-form-column">
					<form v-on:submit.prevent="authLoginUser">
						<h3>Hello!</h3>
						<p>Welcome to our little Vue demo powered by CometChat. Login with the username "superhero1" or "superhero2" and test the chat out.
							To create your own user, see <a href="https://prodocs.cometchat.com/reference#createuser">our documentation</a></p>
							<div class="form-wrapper">
								<label>Username</label>
								<input type="text" name="username" id="username" v-model="username" placeholder="Enter your username" class="form-control" required>
							</div>
							<button type="submit">LOG IN &nbsp;&nbsp;<span v-if="showSpinner" class="fa fa-spin fa-spinner"></span></button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</template>
	<script>
		import { CometChat } from "@cometchat-pro/chat";
		export default {
			data() {
				return {
					username: "",
					showSpinner: false
				};
			},
			methods: {
				authLoginUser() {
					let apiKey = process.env.VUE_APP_COMMETCHAT_API_KEY;
					this.showSpinner = true;

					CometChat.login(this.username, apiKey).then(
						() => {
							this.showSpinner = false;
							this.$router.push({ name: "chat" });
						},
						() => {
							this.showSpinner = false;
						});
				},
				createUser() {
					let apiKey = process.env.VUE_APP_COMMETCHAT_API_KEY;
					let uid = this.username;
					this.showSpinner = true;
					let user = new CometChat.User(uid);
					user.setName(this.username);

					// https://prodocs.cometchat.com/docs/js-quick-start#section-get-your-application-keys
					CometChat.createUser(user, apiKey).then(
						() => {
							
						},
						() => {
							this.showSpinner = false;
						}
						);
				},
			}
		};
	</script>