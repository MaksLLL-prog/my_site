// ✅ Добавлен DOMContentLoaded для надёжности
document.addEventListener('DOMContentLoaded', () => {
  const txs = [
    { id: 1, who: 'Supermarket', type: 'debit', sum: -1200, date: '2025-10-31' },
    { id: 2, who: 'Salary', type: 'credit', sum: 85000, date: '2025-10-28' },
    { id: 3, who: 'Coffee', type: 'debit', sum: -350, date: '2025-10-27' },
  ];

  function fmt(m) {
    return m.toLocaleString('ru-RU', { minimumFractionDigits: 2 });
  }

  function renderTxs() {
    const list = document.getElementById('txList');
    if (!list) return; // ✅ Защита от null

    list.innerHTML = '';
    txs.forEach(t => {
      const el = document.createElement('div');
      el.className = 'txn';
      el.innerHTML = `
        <div class="meta">
          <div class="dot">${t.who.charAt(0)}</div>
          <div>
            <div style="font-weight:700">${t.who}</div>
            <div class="small muted">${t.date}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">${t.sum > 0 ? '+' : '−'} ${fmt(Math.abs(t.sum))}</div>
          <div class="small muted">${t.type === 'debit' ? 'Списание' : 'Зачисление'}</div>
        </div>
      `;
      list.appendChild(el);
    });
  }

  renderTxs();

  // ✅ Исправлено: modal теперь использует grid
  const modal = document.getElementById('modal');
  const openTransfer = document.getElementById('openTransfer');
  const closeModal = document.getElementById('closeModal');
  const sendTransfer = document.getElementById('sendTransfer');
  const toInput = document.getElementById('to');
  const amountInput = document.getElementById('amount');

  if (openTransfer) {
    openTransfer.addEventListener('click', () => {
      modal.style.display = 'grid'; // ✅ Теперь grid поддерживается
      if (toInput) toInput.focus();
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (sendTransfer) {
    sendTransfer.addEventListener('click', () => {
      const to = toInput?.value.trim();
      const amount = parseFloat(amountInput?.value);

      if (!to || !amount || amount <= 0) {
        alert('Пожалуйста, заполните корректно поля.');
        return;
      }

      txs.unshift({
        id: Date.now(),
        who: to,
        type: 'debit',
        sum: -amount,
        date: new Date().toISOString().slice(0, 10)
      });

      renderTxs();
      modal.style.display = 'none';
      if (toInput) toInput.value = '';
      if (amountInput) amountInput.value = '';
      alert('Перевод отправлен.');
    });
  }

  // Закрыть модальное окно по клику на бэкдроп
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
