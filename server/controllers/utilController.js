const covers = [
  "https://example.com/cover1.jpg",
  "https://example.com/cover2.jpg",
  "https://example.com/cover3.jpg"
];

function getRandomInterviewCover() {
  return covers[Math.floor(Math.random() * covers.length)];
}

module.exports = { getRandomInterviewCover };