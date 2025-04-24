function goToApp() {
    window.location.href = '/index'// redirect to your app index.html
  }
  
  function goToSignup() {
    document.getElementById('signupModal').style.display = 'block';
  }
  
  // Close modal
  document.getElementById('closeModal').onclick = function () {
    document.getElementById('signupModal').style.display = 'none';
  };
  
  // Signup logic
  document.getElementById('signupForm').onsubmit = function (e) {
    e.preventDefault();
  
    // Simulate success — in real case, add backend logic here
    document.getElementById('signupModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'block';
  
    // Redirect after 2 seconds
    setTimeout(() => {
      document.getElementById('successModal').style.display = 'none';
      goToApp();
    }, 2000);
  };
  
  // Close modal if clicked outside
  window.onclick = function (event) {
    const signupModal = document.getElementById('signupModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === signupModal) signupModal.style.display = 'none';
    if (event.target === successModal) successModal.style.display = 'none';
  };
  