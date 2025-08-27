function checkForErrors() {
  const $userCards = document.querySelectorAll(".user-card");
  let cardWithError = null;

  $userCards.forEach((card) => {
    const hasError = card.querySelector(".user-card__error");
    if (hasError) {
      card.classList.add("has-error");
      cardWithError = card;
    }
  });

  return cardWithError;
}

function setupUserCardActivation() {
  const $userCards = document.querySelectorAll(".user-card");
  let activeCard = null;

  $userCards.forEach((card) => {
    card.addEventListener("click", () => {
      $userCards.forEach((card) => card.classList.remove("active"));

      if (activeCard && activeCard !== card) {
        const $hasActualError = activeCard.querySelector(".user-card__error");
        if (!$hasActualError) {
          activeCard.classList.remove("has-error");
        }
      }

      card.classList.add("active");
      activeCard = card;
    });
  });
}

checkForErrors();
setupUserCardActivation();
