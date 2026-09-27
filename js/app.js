/**
 * Main Application Script for Modern Royal Pastel North Hindu Wedding Invitation
 * Handles Envelope Opening, Countdown, Calendar Links, RSVP Guestbook, & Customizer Panel
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Flower Petal Shower
  const petalShower = new PetalShower('petalCanvas');
  
  // Initialize Auspicious Wedding Audio
  const audioPlayer = new WeddingAudioPlayer();

  // Title Case Normalizer to ensure cursive calligraphy fonts render cleanly (prevents jumbled all-caps like "RIYA")
  function toTitleCase(str) {
    if (!str) return "";
    return str.trim().split(/\s+/).map(word => {
      if (word.length > 1 && word === word.toUpperCase()) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  // Default Wedding Data Model (Riya & Tarun)
  const defaultWeddingData = {
    brideName: "Riya",
    brideFullName: "Riya Garg",
    brideLineage: "Daughter of Smt. Seema Garg & Shri Manoj Garg",
    groomName: "Tarun",
    groomFullName: "Tarun Goyal",
    groomLineage: "Son of Smt. Meenakshi Goyal & Shri Rajendra Goyal",
    weddingDate: "2026-12-04T19:30:00",
    grandparentsText: "Late Smt. Shanti Devi & Late Shri Ramswaroop Garg",
    parentsText: "Smt. Seema Garg & Shri Manoj Garg • Smt. Meenakshi Goyal & Shri Rajendra Goyal",
    kidsQuote: "“Mere pyare Bua ji ki shaadi mein Jalool-Jalool aana!”",
    kidsNames: "— Lots of love from Aarav, Vihaan & Pari",
    venueName: "Miraya Crown",
    venueCity: "Sector 16B, Greater Noida West",
    customMusicUrl: ""
  };

  // Load Saved Data or Default
  const weddingData = { ...defaultWeddingData };

  // Apply Data to DOM
  function applyWeddingData() {
    // Format names in pristine Title Case so cursive calligraphy flows gracefully
    const bride = toTitleCase(weddingData.brideName || "Riya");
    const groom = toTitleCase(weddingData.groomName || "Tarun");
    const brideFull = toTitleCase(weddingData.brideFullName || "Riya Garg");
    const groomFull = toTitleCase(weddingData.groomFullName || "Tarun Goyal");
    const weddingDate = new Date(weddingData.weddingDate);
    const day = weddingDate.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    const formattedDate = `${day}${suffix} ${weddingDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    const formattedDay = weddingDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Envelope Initials & Names
    const initials = `${bride.charAt(0)} & ${groom.charAt(0)}`;
    const initialsEl = document.getElementById('envelopeInitials');
    if (initialsEl) initialsEl.textContent = initials;

    const envCouple = document.getElementById('envelopeCouple');
    if (envCouple) envCouple.textContent = `${bride} & ${groom}`;
    const envelopeDateEl = document.getElementById('envelopeDateDisplay');
    if (envelopeDateEl) envelopeDateEl.textContent = `${formattedDate} • ${weddingData.venueName}, ${weddingData.venueCity}`;
    const weddingDateEl = document.getElementById('weddingDateDisplay');
    if (weddingDateEl) weddingDateEl.textContent = `${formattedDay}, ${formattedDate} • ${weddingData.venueCity}`;

    // Main Names
    const bNameEl = document.getElementById('brideNameDisplay');
    if (bNameEl) bNameEl.textContent = brideFull;
    const bLineageEl = document.getElementById('brideLineageDisplay');
    if (bLineageEl) bLineageEl.textContent = weddingData.brideLineage;

    const gNameEl = document.getElementById('groomNameDisplay');
    if (gNameEl) gNameEl.textContent = groomFull;
    const gLineageEl = document.getElementById('groomLineageDisplay');
    if (gLineageEl) gLineageEl.textContent = weddingData.groomLineage;

    // Family
    const gpEl = document.getElementById('grandparentsDisplay');
    if (gpEl) gpEl.textContent = weddingData.grandparentsText;

    const pEl = document.getElementById('parentsDisplay');
    if (pEl) pEl.textContent = weddingData.parentsText;

    const kqEl = document.getElementById('kidsQuoteDisplay');
    if (kqEl) kqEl.textContent = weddingData.kidsQuote;

    const knEl = document.getElementById('kidsNamesDisplay');
    if (knEl) knEl.textContent = weddingData.kidsNames;

    // Music
    if (weddingData.customMusicUrl) {
      audioPlayer.setCustomAudio(weddingData.customMusicUrl);
    }

    // WhatsApp Message update
    updateWhatsAppShareLink();
  }

  applyWeddingData();

  // =========================================================================
  // 1. Royal Palace Envelope Opening Sequence with 3D Cinematic Physics
  // =========================================================================
  const envelopeScreen = document.getElementById('envelopeScreen');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const openInviteBtn = document.getElementById('openInviteBtn');
  const cardEnterBtn = document.getElementById('cardEnterBtn');
  const envelopeCard = document.getElementById('envelopeCard');
  const mainContent = document.getElementById('mainContent');
  let isEnvelopeOpened = false;
  let hasEnteredPalace = false;
  let pendingPalaceEntry = null;

  // Smooth 3D Mouse Parallax Tilt for Envelope (Zero-jerk lerp)
  if (envelopeWrapper) {
    envelopeWrapper.style.transform = 'rotateX(18deg) rotateY(-8deg) rotateZ(1.5deg)';
    
    let envTargetX = 18, envTargetY = -8, envTargetScale = 1;
    let envCurrX = 18, envCurrY = -8, envCurrScale = 1;
    let isEnvTicking = false;

    function renderEnvelopeTilt() {
      if (isEnvelopeOpened || envelopeWrapper.classList.contains('open-anim')) return;
      envCurrX += (envTargetX - envCurrX) * 0.12;
      envCurrY += (envTargetY - envCurrY) * 0.12;
      envCurrScale += (envTargetScale - envCurrScale) * 0.12;

      envelopeWrapper.style.transform = `rotateX(${envCurrX.toFixed(2)}deg) rotateY(${envCurrY.toFixed(2)}deg) rotateZ(1.5deg) scale(${envCurrScale.toFixed(3)})`;

      if (Math.abs(envTargetX - envCurrX) > 0.02 || Math.abs(envTargetY - envCurrY) > 0.02) {
        requestAnimationFrame(renderEnvelopeTilt);
      } else {
        isEnvTicking = false;
      }
    }

    envelopeWrapper.addEventListener('mousemove', (e) => {
      if (isEnvelopeOpened || envelopeWrapper.classList.contains('open-anim')) return;
      const rect = envelopeWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      envTargetX = 18 - (y / (rect.height / 2)) * 11;
      envTargetY = -8 + (x / (rect.width / 2)) * 13;
      envTargetScale = 1.03;

      if (!isEnvTicking) {
        isEnvTicking = true;
        requestAnimationFrame(renderEnvelopeTilt);
      }
    });

    envelopeWrapper.addEventListener('mouseleave', () => {
      if (isEnvelopeOpened || envelopeWrapper.classList.contains('open-anim')) return;
      envTargetX = 18;
      envTargetY = -8;
      envTargetScale = 1;
      if (!isEnvTicking) {
        isEnvTicking = true;
        requestAnimationFrame(renderEnvelopeTilt);
      }
    });

    // Gentle phone gyro tilt, with the permission request kept inside a user gesture for iOS.
    if (window.DeviceOrientationEvent) {
      let motionTiltEnabled = false;

      function handleDeviceOrientation(event) {
        if (isEnvelopeOpened || envelopeWrapper.classList.contains('open-anim')) return;
        const beta = Math.max(-45, Math.min(90, event.beta || 0));
        const gamma = Math.max(-30, Math.min(30, event.gamma || 0));
        envTargetX = Math.max(10, Math.min(26, 18 + (beta - 45) * 0.12));
        envTargetY = Math.max(-18, Math.min(2, -8 + gamma * 0.32));
        envTargetScale = 1.015;

        if (!isEnvTicking) {
          isEnvTicking = true;
          requestAnimationFrame(renderEnvelopeTilt);
        }
      }

      async function enableDeviceTilt() {
        if (motionTiltEnabled) return;
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission !== 'granted') return;
          } catch (error) {
            return;
          }
        }
        motionTiltEnabled = true;
        window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
      }

      envelopeScreen?.addEventListener('pointerdown', enableDeviceTilt, { once: true, passive: true });
    }
  }

  function enterPalace() {
    if (hasEnteredPalace) return;

    if (envelopeScreen && envelopeScreen.classList.contains('envelope-opening')) {
      if (pendingPalaceEntry) clearTimeout(pendingPalaceEntry);
      pendingPalaceEntry = setTimeout(() => {
        pendingPalaceEntry = null;
        enterPalace();
      }, 3950);
      return;
    }

    hasEnteredPalace = true;
    
    // Grand flower shower
    petalShower.burst(35, window.innerWidth / 2, window.innerHeight / 2);
    
    // Cinematic camera fly-through into palace
    if (envelopeScreen) {
      envelopeScreen.classList.add('opened');
    }
    if (mainContent) {
      requestAnimationFrame(() => mainContent.classList.add('website-revealed'));
    }
    document.body.style.overflow = 'auto';

    // Ensure auspicious shehnai background music is playing
    if (!audioPlayer.isPlaying) {
      audioPlayer.play();
    }
  }

  function openEnvelope() {
    if (!envelopeWrapper || isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    if (envelopeScreen) {
      envelopeScreen.classList.add('envelope-opening');
      setTimeout(() => envelopeScreen.classList.remove('envelope-opening'), 3900);
    }
    
    envelopeWrapper.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.02)';
    envelopeWrapper.classList.add('open-anim');
    
    // Celebratory rose & marigold petal burst
    const center = envelopeWrapper.getBoundingClientRect();
    petalShower.burst(38, center.left + center.width / 2, center.top + center.height / 2);

    // Auspicious Shehnai wedding audio
    audioPlayer.play();

    // Update bottom button to enter
    if (openInviteBtn) {
      openInviteBtn.innerHTML = '<span>पधारें • Enter Royal Celebration</span> <span>✨</span>';
      openInviteBtn.onclick = enterPalace;
    }

    // Allow the light reveal to finish before the invitation enters automatically.
    setTimeout(() => {
      if (!hasEnteredPalace) {
        enterPalace();
      }
    }, 4000);
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', (e) => {
      if (!isEnvelopeOpened) {
        openEnvelope();
      }
    });
  }

  if (cardEnterBtn) {
    cardEnterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      enterPalace();
    });
  }

  if (envelopeCard) {
    envelopeCard.addEventListener('click', (e) => {
      if (isEnvelopeOpened) {
        e.stopPropagation();
        enterPalace();
      }
    });
  }

  if (openInviteBtn) {
    openInviteBtn.addEventListener('click', () => {
      if (!isEnvelopeOpened) {
        openEnvelope();
      } else {
        enterPalace();
      }
    });
  }

  // =========================================================================
  // 2. Floating Controls (Music & Petal Shower)
  // =========================================================================
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      audioPlayer.toggle();
    });
  }

  const petalToggleBtn = document.getElementById('petalToggleBtn');
  if (petalToggleBtn) {
    petalToggleBtn.addEventListener('click', () => {
      const active = petalShower.toggle();
      petalToggleBtn.innerHTML = active ? '🌸' : '🍂';
      petalToggleBtn.title = active ? 'Pause Flower Shower' : 'Start Flower Shower';
    });
  }

  const petalBurstBtn = document.getElementById('petalBurstBtn');
  if (petalBurstBtn) {
    petalBurstBtn.addEventListener('click', () => {
      petalShower.burst(50);
    });
  }

  // =========================================================================
  // 3. Live Muhurat Countdown
  // =========================================================================
  function updateCountdown() {
    const targetDate = new Date(weddingData.weddingDate).getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');
    const secondsEl = document.getElementById('countSeconds');

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // =========================================================================
  // 4. Calendar Link Helper & .ics Download
  // =========================================================================
  window.downloadIcs = function(title, description, location, startDateIso, endDateIso) {
    const formatDate = (isoStr) => {
      return new Date(isoStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Royal Hindu Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${formatDate(startDateIso)}`,
      `DTEND:${formatDate(endDateIso)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // 5. WhatsApp Share Formatting
  // =========================================================================
  function updateWhatsAppShareLink() {
    const shareBtn = document.getElementById('whatsappShareBtn');
    if (!shareBtn) return;

    const shareDate = new Date(weddingData.weddingDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const message = `✨ *|| श्री गणेशाय नमः ||* ✨\n\n` +
      `We cordially invite you and your family to celebrate the auspicious wedding ceremonies of our beloved sister *${weddingData.brideName}* with *${weddingData.groomName}*! 🪷\n\n` +
      `📅 *Date:* ${shareDate}\n` +
      `📍 *Venue:* ${weddingData.venueName}, ${weddingData.venueCity}\n\n` +
      `Kindly view the complete interactive digital royal invitation with event itinerary, muhurat & timings here:\n${window.location.href}\n\n` +
      `_With warm regards & blessings,_\n*Garg & Goyal Family*`;

    const encoded = encodeURIComponent(message);
    shareBtn.href = `https://api.whatsapp.com/send?text=${encoded}`;
  }

  // =========================================================================
  // 6. Interactive RSVP & Shubh-Kamnayein (Blessings Wall)
  // =========================================================================
  const rsvpForm = document.getElementById('rsvpForm');
  const blessingsContainer = document.getElementById('blessingsContainer');

  const defaultBlessings = [
    {
      name: "Ramesh Uncle & Family",
      side: "Ladkiwale",
      wishes: `Wishing dear ${weddingData.brideName || 'Riya'} and ${weddingData.groomName || 'Tarun'} a lifetime of happiness, unconditional love, and endless smiles! May God bless you both always.`
    },
    {
      name: "Sneha & Amit Kapoor",
      side: "Friends & Family",
      wishes: "Heartiest congratulations! Can't wait to dance at the Sangeet night! Looking forward to the grand celebration."
    },
    {
      name: "Dadi & Babuji",
      side: "Elders Blessings",
      wishes: "सदा सुहागन रहो, दोनों का जीवन सुख, समृद्धि और आनंद से भरा रहे। अनंत आशीर्वाद!"
    }
  ];

  function getSavedBlessings() {
    const saved = localStorage.getItem('wedding_blessings_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultBlessings;
  }

  function renderBlessings() {
    if (!blessingsContainer) return;
    const blessings = getSavedBlessings();
    blessingsContainer.innerHTML = '';

    blessings.forEach(item => {
      const card = document.createElement('div');
      card.className = 'blessing-item';
      card.innerHTML = `
        <div class="blessing-sender">
          <span>${escapeHtml(item.name)}</span>
          <span class="blessing-tag">${escapeHtml(item.side || 'Well-wisher')}</span>
        </div>
        <p class="blessing-message">“${escapeHtml(item.wishes)}”</p>
      `;
      blessingsContainer.prepend(card);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guestName').value.trim();
      const guestSide = document.getElementById('guestSide').value;
      const guestAttendance = document.getElementById('guestAttendance').value;
      const guestCount = document.getElementById('guestCount').value;
      const guestWishes = document.getElementById('guestWishes').value.trim();

      if (!guestName || !guestWishes) return;

      const newBlessing = {
        name: guestName,
        side: guestSide,
        attendance: guestAttendance,
        count: guestCount,
        wishes: guestWishes,
        timestamp: new Date().toISOString()
      };

      const existing = getSavedBlessings();
      existing.push(newBlessing);
      localStorage.setItem('wedding_blessings_list', JSON.stringify(existing));

      renderBlessings();
      rsvpForm.reset();

      // Celebrate with flower burst
      petalShower.burst(60);

      const statusEl = document.getElementById('rsvpStatusMsg');
      if (statusEl) {
        statusEl.textContent = "🌸 Thank you! Your warm blessings & RSVP have been received with love.";
        statusEl.style.display = 'block';
        setTimeout(() => {
          statusEl.style.display = 'none';
        }, 5000);
      }
    });
  }

  renderBlessings();

  // =========================================================================
  // 7. Sister's Customizer Panel (Admin / Personalization Drawer)
  // =========================================================================
  const openCustomizerBtn = document.getElementById('openCustomizerBtn');
  const closeCustomizerBtn = document.getElementById('closeCustomizerBtn');
  const customizerDrawer = document.getElementById('customizerDrawer');
  const customizerBackdrop = document.getElementById('customizerBackdrop');
  const customizerForm = document.getElementById('customizerForm');
  const resetCustomizerBtn = document.getElementById('resetCustomizerBtn');

  function openDrawer() {
    customizerDrawer.classList.add('active');
    customizerBackdrop.classList.add('active');
    populateCustomizerInputs();
  }

  function closeDrawer() {
    customizerDrawer.classList.remove('active');
    customizerBackdrop.classList.remove('active');
  }

  if (openCustomizerBtn) openCustomizerBtn.addEventListener('click', openDrawer);
  if (closeCustomizerBtn) closeCustomizerBtn.addEventListener('click', closeDrawer);
  if (customizerBackdrop) customizerBackdrop.addEventListener('click', closeDrawer);

  function populateCustomizerInputs() {
    document.getElementById('inputBrideName').value = weddingData.brideName;
    document.getElementById('inputBrideFullName').value = weddingData.brideFullName;
    document.getElementById('inputBrideLineage').value = weddingData.brideLineage;

    document.getElementById('inputGroomName').value = weddingData.groomName;
    document.getElementById('inputGroomFullName').value = weddingData.groomFullName;
    document.getElementById('inputGroomLineage').value = weddingData.groomLineage;

    document.getElementById('inputGrandparents').value = weddingData.grandparentsText;
    document.getElementById('inputParents').value = weddingData.parentsText;
    document.getElementById('inputKidsQuote').value = weddingData.kidsQuote;
    document.getElementById('inputKidsNames').value = weddingData.kidsNames;

    document.getElementById('inputWeddingDate').value = weddingData.weddingDate.substring(0, 16);
    document.getElementById('inputVenueName').value = weddingData.venueName;
    document.getElementById('inputVenueCity').value = weddingData.venueCity;
    document.getElementById('inputMusicUrl').value = weddingData.customMusicUrl || "";
  }

  if (customizerForm) {
    customizerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      weddingData.brideName = toTitleCase(document.getElementById('inputBrideName').value) || defaultWeddingData.brideName;
      weddingData.brideFullName = toTitleCase(document.getElementById('inputBrideFullName').value) || defaultWeddingData.brideFullName;
      weddingData.brideLineage = document.getElementById('inputBrideLineage').value.trim() || defaultWeddingData.brideLineage;

      weddingData.groomName = toTitleCase(document.getElementById('inputGroomName').value) || defaultWeddingData.groomName;
      weddingData.groomFullName = toTitleCase(document.getElementById('inputGroomFullName').value) || defaultWeddingData.groomFullName;
      weddingData.groomLineage = document.getElementById('inputGroomLineage').value.trim() || defaultWeddingData.groomLineage;

      weddingData.grandparentsText = document.getElementById('inputGrandparents').value.trim() || defaultWeddingData.grandparentsText;
      weddingData.parentsText = document.getElementById('inputParents').value.trim() || defaultWeddingData.parentsText;
      weddingData.kidsQuote = document.getElementById('inputKidsQuote').value.trim() || defaultWeddingData.kidsQuote;
      weddingData.kidsNames = document.getElementById('inputKidsNames').value.trim() || defaultWeddingData.kidsNames;

      weddingData.weddingDate = document.getElementById('inputWeddingDate').value || defaultWeddingData.weddingDate;
      weddingData.venueName = document.getElementById('inputVenueName').value.trim() || defaultWeddingData.venueName;
      weddingData.venueCity = document.getElementById('inputVenueCity').value.trim() || defaultWeddingData.venueCity;
      weddingData.customMusicUrl = document.getElementById('inputMusicUrl').value.trim();

      try {
        localStorage.setItem('wedding_invitation_custom_data', JSON.stringify(weddingData));
      } catch (storageError) {
        console.error('Unable to save invitation details:', storageError);
        alert('Unable to save changes in this browser. Please allow site storage and try again.');
        return;
      }
      applyWeddingData();
      updateCountdown();
      petalShower.burst(30);
      closeDrawer();
      alert("Invitation details updated successfully!");
    });
  }

  if (resetCustomizerBtn) {
    resetCustomizerBtn.addEventListener('click', () => {
      localStorage.removeItem('wedding_invitation_custom_data');
      weddingData = { ...defaultWeddingData };
      populateCustomizerInputs();
      applyWeddingData();
      updateCountdown();
      petalShower.burst(25);
      alert("✨ Details reset to default royal names (Riya & Tarun) & venue!");
    });
  }

  // =========================================================================
  // 8. ROYAL PHOTO COLLAGE & LIGHTBOX CONTROLLER
  // =========================================================================
  const royalLightbox = document.getElementById('royalLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  function openLightbox(src, caption) {
    if (!royalLightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    royalLightbox.classList.add('active');
    royalLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!royalLightbox) return;
    royalLightbox.classList.remove('active');
    royalLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  document.querySelectorAll('.collage-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption');
      if (src) openLightbox(src, caption);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && royalLightbox && royalLightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // =========================================================================
  // 9. COUPLE PHOTO UPLOAD & LOCAL STORAGE MANAGER
  // =========================================================================
  function loadSavedCouplePhotos() {
    const savedPhotos = localStorage.getItem('wedding_custom_photos');
    if (savedPhotos) {
      try {
        const photos = JSON.parse(savedPhotos);
        for (let i = 0; i < 4; i++) {
          if (photos[`slide${i}`]) {
            const img = document.getElementById(`scrollyImg${i}`);
            if (img) img.src = photos[`slide${i}`];
          }
        }
        if (photos.slide0) {
          const hero = document.getElementById('heroCoupleBannerImg');
          if (hero) hero.src = photos.slide0;
        }
      } catch (e) {
        console.error("Error loading saved photos:", e);
      }
    }
  }

  loadSavedCouplePhotos();

  [0, 1, 2, 3].forEach(idx => {
    const input = document.getElementById(`uploadPhoto${idx}`);
    if (input) {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const targetImg = document.getElementById(`scrollyImg${idx}`);
          if (targetImg) targetImg.src = dataUrl;

          if (idx === 0) {
            const hero = document.getElementById('heroCoupleBannerImg');
            if (hero) hero.src = dataUrl;
          }

          // Save to localStorage
          try {
            const curr = JSON.parse(localStorage.getItem('wedding_custom_photos') || '{}');
            curr[`slide${idx}`] = dataUrl;
            localStorage.setItem('wedding_custom_photos', JSON.stringify(curr));
          } catch (storageErr) {
            console.warn("Storage quota note:", storageErr);
          }

          petalShower.burst(25);
          alert(`✨ Photo for Slide ${idx + 1} updated successfully!`);
        };
        reader.readAsDataURL(file);
      });
    }
  });

  // =========================================================================
  // 10. GLOBAL 3D CARD PARALLAX TILT & HOLOGRAPHIC GOLD SPECULAR GLARE
  // =========================================================================
  // =========================================================================
  // 10. GLOBAL 3D CARD PARALLAX TILT & HOLOGRAPHIC GOLD SPECULAR GLARE
  // =========================================================================
  function init3DCardTilt() {
    // Only enable mouse tilt on non-touch devices with fine pointers
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const tiltTargets = document.querySelectorAll(
        '.ganesha-card, .couple-person-card, .event-card, .family-photo-card, .countdown-box, .couple-hero-banner, .collage-item'
      );
      
      tiltTargets.forEach(card => {
        card.classList.add('has-3d-glare');
        let cardTargetRotX = 0, cardTargetRotY = 0;
        let cardCurrRotX = 0, cardCurrRotY = 0;
        let isCardTicking = false;

        function renderCardTilt() {
          cardCurrRotX += (cardTargetRotX - cardCurrRotX) * 0.16;
          cardCurrRotY += (cardTargetRotY - cardCurrRotY) * 0.16;

          const lift = Math.abs(cardCurrRotX) > 0.05 ? -3 : 0;
          const cardScale = Math.abs(cardCurrRotX) > 0.05 || Math.abs(cardCurrRotY) > 0.05 ? 0.985 : 1;
          card.style.transform = `perspective(1000px) rotateX(${cardCurrRotX.toFixed(2)}deg) rotateY(${cardCurrRotY.toFixed(2)}deg) translateY(${lift}px) scale(${cardScale})`;

          if (Math.abs(cardTargetRotX - cardCurrRotX) > 0.02 || Math.abs(cardTargetRotY - cardCurrRotY) > 0.02) {
            requestAnimationFrame(renderCardTilt);
          } else {
            isCardTicking = false;
          }
        }

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          cardTargetRotX = -((y - centerY) / centerY) * 3.5;
          cardTargetRotY = ((x - centerX) / centerX) * 3.5;
          
          card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
          card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

          if (!isCardTicking) {
            isCardTicking = true;
            requestAnimationFrame(renderCardTilt);
          }
        });

        card.addEventListener('mouseleave', () => {
          cardTargetRotX = 0;
          cardTargetRotY = 0;
          if (!isCardTicking) {
            isCardTicking = true;
            requestAnimationFrame(renderCardTilt);
          }
        });
      });
    }
  }

  init3DCardTilt();

  // =========================================================================
  // 11. SACRED LORD GANESHA BACKGROUND PARALLAX & AMBIENT DEPTH
  // Monumental Lord Ganesha backdrop smoothly reacts to scroll depth
  // =========================================================================
  const ganeshaBgImg = document.getElementById('ganeshaBgImg');

  if (ganeshaBgImg) {
    let ticking = false;

    function renderGaneshaBgParallax() {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const progress = Math.min(1, Math.max(0, scrollY / 600));

      const bgParallax = (scrollY * 0.03).toFixed(1);
      const bgScale = (1.05 + progress * 0.04).toFixed(3);

      ganeshaBgImg.style.transform = `scale(${bgScale}) translateY(${bgParallax}px)`;

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(renderGaneshaBgParallax);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    renderGaneshaBgParallax();
  }

  // =========================================================================
  // 12. SCROLL-TRIGGERED REVEAL ANIMATIONS (Sections + Text Reveals)
  // Beautiful staggered text reveals for names, dates, titles with golden sparkle
  // =========================================================================
  function initScrollReveals() {
    // Section-level reveals (fade in + slide up)
    const revealTargets = document.querySelectorAll(
      '.hero-section, .wedding-announcement, .royal-collage-section, .countdown-section, .events-section, .family-section, .rsvp-section, .event-card, .family-photo-card'
    );

    revealTargets.forEach(el => el.classList.add('reveal-section'));

    // Text-level reveals (names, dates, titles, paragraphs, ampersand)
    const textRevealTargets = document.querySelectorAll(
      '.name-reveal, .date-reveal, .title-reveal, .slide-reveal, .pop-reveal'
    );

    if ('IntersectionObserver' in window) {
      // Section observer
      const sectionObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealTargets.forEach(el => sectionObserver.observe(el));

      // Text reveal observer with staggered delays
      const textObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Find all sibling text-reveals in the same parent for staggering
            const parent = entry.target.closest('.couple-person-card, .wedding-announcement, .hero-section, .countdown-box, .ganesha-card');
            if (parent) {
              const siblings = parent.querySelectorAll('.name-reveal, .date-reveal, .title-reveal, .slide-reveal, .pop-reveal');
              siblings.forEach((sib, idx) => {
                setTimeout(() => {
                  sib.classList.add('is-revealed');
                }, idx * 150); // 150ms stagger between each element
              });
              // Unobserve all siblings since we revealed them
              siblings.forEach(sib => obs.unobserve(sib));
            } else {
              // Standalone element
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
      });

      textRevealTargets.forEach(el => textObserver.observe(el));
    } else {
      // Fallback: reveal everything immediately
      revealTargets.forEach(el => el.classList.add('is-revealed'));
      textRevealTargets.forEach(el => el.classList.add('is-revealed'));
    }
  }

  initScrollReveals();

});

