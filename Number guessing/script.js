var a = document.getElementById("one");
var b = document.getElementById("res");
var rn = Math.floor(Math.random() * 10) + 1;
var totalscore = 10;
var score = document.getElementById("sc");

function check() {
    var num = Number(a.value);
    if (totalscore <= 0) {
        b.textContent = "Game Over! Refresh to play again.";
        return;
    }

    if (rn === num) {
        b.textContent = "Right";
        alert("You Won! 🎉");
    } else {
        totalscore = totalscore - 1;
        score.textContent = "Score: " + totalscore;
        b.textContent = "Wrong";
        if (totalscore === 0) {
            alert("Game Over! The correct number was " + rn);
        }
    }
}
