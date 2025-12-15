window.notifications = {
  add(message) {
    console.log("[notification]", message);

    const list = document.getElementById("notificationList");
    if (!list) return;

    const li = document.createElement("li");
    li.textContent = message;
    list.prepend(li);
  }
};