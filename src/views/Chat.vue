<template>
	<div class="booker">
		<div class="chat">
			<div class="container">
				<div class="msg-header">
					<div class="active">
						<h5>Chat</h5>
					</div>
				</div>
				<div class="chat-page">
					<div class="msg-inbox">
						<div class="chats" id="chats">
							<div class="msg-page" id="msg-page">
								<div
								v-if="loadingMessages"
								class="loading-messages-container"
								>
								<spinner :size="100"/>
								<span class="loading-text">
									Loading Messages
								</span>
							</div>
							<div class="text-center img-fluid empty-chat" v-else-if="!groupMessages.length" >
								<div class="empty-chat-holder">
									<img src="../assets/empty-state.svg" class="img-res" alt="empty chat image">
								</div>
								<div>
									<h2> No new message? </h2>
									<h6 class="empty-chat-sub-title">
										Send your first message below.
									</h6>
								</div>
							</div>
							<div v-else>
								<div>
									<div v-for="(message, i) in groupMessages" v-bind:key="`${i}-${message.id}`">
										<div class="received-chats" v-if="message.sender.uid != user.uid">
											<div class="received-chats-img">
												<img v-bind:src="message.sender.avatar" alt="" class="avatar">
											</div>
											<div class="received-msg">
												<div class="received-msg-inbox">
													<p><span>{{ message.sender.uid }}</span><br>{{ message.data.text }}</p>
												</div>
											</div>
										</div>
										<div class="outgoing-chats" v-else>
											<div class="outgoing-chats-msg">
												<p>{{ message.data.text }}</p>
											</div>
											<div class="outgoing-chats-img">
												<img v-bind:src="message.sender.avatar" alt="" class="avatar">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="msg-bottom">
					<form class="message-form" v-on:submit.prevent="sendGroupMessage">
						<div class="input-group">
							<input type="text" class="form-control message-input" placeholder="Type something" v-model="chatMessage" required>
							<spinner
							v-if="sendingMessage"
							class="sending-message-spinner"
							:size="30"
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
	import { CometChat } from "@cometchat-pro/chat";
	import Spinner from "../components/Spinner.vue";

	export default {
		name: "home",
		components: {
			Spinner
		},
		data() {
			return {
				user: null,
				sendingMessage: false,
				chatMessage: "",
				loggingOut: false,
				groupMessages: [],
				loadingMessages: false
			};
		},
		mounted() {
			this.loadingMessages = true;
			let listenerID = "UNIQUE_LISTENER_ID";
			const messagesRequest = new CometChat.MessagesRequestBuilder().setLimit(100).build();
			messagesRequest.fetchPrevious().then(
				messages => {
					this.groupMessages = [...this.groupMessages, ...messages];
					this.loadingMessages = false;
					this.$nextTick(() => {
						this.scrollToBottom();
					});
				},
				() => {
					this.$router.push({ name: 'login' });
				}
				);


			CometChat.addMessageListener(
				listenerID, 
				new CometChat.MessageListener({
					onTextMessageReceived: textMessage => {
            // Handle text message
            this.groupMessages = [...this.groupMessages, textMessage];
            this.loadingMessages = false;
            this.$nextTick(() => {
             this.scrollToBottom();
           });
          }
        })
				);
		},
		created() {
			this.getLoggedInUser();
		},
		methods: {
			getLoggedInUser() {
				CometChat.getLoggedinUser().then(
					user => {
						this.user = user;
					},
					() => {
						this.$router.push({ name: "login" });
					});
			},
			sendGroupMessage() {
				this.sendingMessage = true;

				let receiverID = process.env.VUE_APP_COMMETCHAT_GUID;
				let messageText = this.chatMessage;
				let receiverType = CometChat.RECEIVER_TYPE.GROUP;
				let globalContext = this;
				let textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

				CometChat.sendMessage(textMessage).then(
					message => {
						this.chatMessage = "";
						this.sendingMessage = false;
            // Text Message Sent Successfully
            this.groupMessages = [...globalContext.groupMessages, message];
            this.$nextTick(() => {
             this.scrollToBottom()
           })
          },
          () => {
          });
			},
			scrollToBottom() {
				const chat = document.getElementById("msg-page");
				chat.scrollTo(0, chat.scrollHeight + 30);
			},
		}
	};
</script>