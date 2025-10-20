  let ministryData = {}
  let currentMinistry = null
  let filteredMinistries = {}

  function convertPhoneNumber(input) {
    // Remove any spaces or dashes
    const cleaned = input.replace(/[\s-]/g, "")

    // If it starts with 0, replace with +254
    if (cleaned.startsWith("0")) {
      return "+254" + cleaned.substring(1)
    }

    // If it starts with 7 or 1 (9 digits), add +254
    if ((cleaned.startsWith("7") || cleaned.startsWith("1")) && cleaned.length === 9) {
      return "+254" + cleaned
    }

    // If it already has +254, return as is
    if (cleaned.startsWith("+254")) {
      return cleaned
    }

    // Otherwise return the input as is (for validation to catch)
    return cleaned
  }

  // Initialize the app
  document.addEventListener("DOMContentLoaded", async () => {
    await loadData()
    renderMinistryButtons()
    setupSearchFunctionality()
  })

  // Load data from data.js
  async function loadData() {
    try {
      if (window.ministryData) {
        ministryData = window.ministryData
        filteredMinistries = JSON.parse(JSON.stringify(ministryData))
      } else {
        console.error("Ministry data not found")
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  function setupSearchFunctionality() {
    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim()

      if (!query) {
        filteredMinistries = JSON.parse(JSON.stringify(ministryData))
      } else {
        filteredMinistries = {}
        Object.keys(ministryData).forEach((ministry) => {
          if (ministry.toLowerCase().includes(query)) {
            filteredMinistries[ministry] = ministryData[ministry]
          }
        })
      }

      renderMinistryButtons()
    })
  }

  // Render ministry buttons
  function renderMinistryButtons() {
    const grid = document.getElementById("ministryGrid")
    grid.innerHTML = ""

    const ministries = Object.keys(filteredMinistries).sort()

    if (ministries.length === 0) {
      grid.innerHTML =
        '<div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: #999;">No ministries found</div>'
      return
    }

    ministries.forEach((ministry) => {
      const btn = document.createElement("button")
      btn.className = "ministry-btn"
      btn.textContent = ministry
      btn.onclick = () => openModal(ministry)
      grid.appendChild(btn)
    })
  }

  // Open modal with ministry details
  function openModal(ministry) {
    currentMinistry = ministry
    const modal = document.getElementById("ministryModal")
    const title = document.getElementById("ministryTitle")
    const membersList = document.getElementById("membersList")
    const phoneInput = document.getElementById("phoneInput")

    title.textContent = ministry
    phoneInput.value = ""

    // Render members
    membersList.innerHTML = ""
    const members = ministryData[ministry]

    members.forEach((member) => {
      const card = document.createElement("div")
      card.className = "member-card"
      card.innerHTML = `
        <div class="member-name">${member.name}</div>
        <div class="member-position">${member.position}</div>
        <div class="member-phone">${member.phone || "N/A"}</div>
      `
      membersList.appendChild(card)
    })

    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }

  // Close modal
  function closeModal() {
    const modal = document.getElementById("ministryModal")
    modal.classList.add("hidden")
    currentMinistry = null
    document.body.style.overflow = "auto"
  }

  // Close modal when clicking outside
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("ministryModal")
    const modalContent = document.querySelector(".modal-content")
    if (e.target === modal) {
      closeModal()
    }
  })

  function sendToWhatsApp() {
    const phoneInput = document.getElementById("phoneInput")
    const userPhoneInput = phoneInput.value.trim()

    // Validate phone number is not empty
    if (!userPhoneInput) {
      alert("Please enter your WhatsApp number")
      return
    }

    // Convert the phone number
    const userPhone = convertPhoneNumber(userPhoneInput)

    // Validate converted phone number
    if (!userPhone.startsWith("+254") || userPhone.length !== 13) {
      alert("Invalid phone number. Please enter a valid Kenyan number (e.g., 712345678 or 0712345678)")
      return
    }

    // Generate message
    const members = ministryData[currentMinistry]
    let message = `Leaders for ${currentMinistry}:\n\n`

    members.forEach((member) => {
      message += `${member.position}: ${member.name} - ${member.phone || "N/A"}\n`
    })

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)

    // Create WhatsApp link with converted phone number
    const whatsappLink = `https://wa.me/${userPhone}?text=${encodedMessage}`

    // Open WhatsApp
    window.open(whatsappLink, "_blank")
  }

  // Allow Enter key to send WhatsApp message
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && document.getElementById("phoneInput") === document.activeElement) {
      sendToWhatsApp()
    }
  })
