document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('categoryChart').getContext('2d');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Corporate', 'Product Launch', 'Wedding', 'Social'],
      datasets: [
        {
          data: [40, 20, 20, 20],
          backgroundColor: [
            '#38b6ff', 
            '#3ed0a6', 
            '#ffc93c', 
            '#79d0f9'  
          ],
          borderWidth: 0,
          hoverOffset: 4
        }
      ]
    },
    options: {
      cutout: '72%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false 
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return ` ${context.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });
});