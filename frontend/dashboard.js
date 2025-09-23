// enviar dado do form
const form = document.getElementById('data-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = parseFloat(document.getElementById('value').value);
    const source = document.getElementById('source').value || 'web';
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ value, source })
      });
      alert('Dado enviado');
      document.getElementById('value').value = '';
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar');
    }
  });

  // botão que dispara análise Python via Node
  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
      analyzeBtn.disabled = true;
      analyzeBtn.innerText = 'Analisando...';
      try {
        const res = await fetch('/api/analyze', { method: 'POST' });
        const data = await res.json();
        alert('Análise concluída: ' + JSON.stringify(data));
      } catch (err) {
        console.error(err);
        alert('Erro na análise');
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerText = 'Executar Análise (Python)';
      }
    });
  }
}

// código compartilhado para o dashboard.html
async function loadMetricsAndDrawChart() {
  try {
    const resp = await fetch('/api/metrics');
    const json = await resp.json();
    const rows = json.rows || [];
    // tabela
    const tbody = document.querySelector('#metrics-table tbody');
    if (tbody) {
      tbody.innerHTML = '';
      rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.id}</td><td>${r.metric_name}</td><td>${r.metric_value}</td><td>${new Date(r.computed_at).toLocaleString()}</td>`;
        tbody.appendChild(tr);
      });
    }
    // gráfico (usando metric_name + value)
    const labels = rows.map(r => `${r.metric_name}#${r.id}`).reverse();
    const data = rows.map(r => Number(r.metric_value)).reverse();

    const ctx = document.getElementById('metricsChart');
    if (!ctx) return;
    // criar/atualizar gráfico
    if (window.myChart) {
      window.myChart.data.labels = labels;
      window.myChart.data.datasets[0].data = data;
      window.myChart.update();
    } else {
      window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Metric value', data }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  } catch (err) {
    console.error('erro carregando metrics', err);
  }
}

const refreshBtn = document.getElementById('refresh-btn');
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => loadMetricsAndDrawChart());
  // load on open
  loadMetricsAndDrawChart();
}
