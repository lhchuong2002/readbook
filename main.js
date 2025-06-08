document.addEventListener('DOMContentLoaded', () => {
    const newsListEl = document.getElementById('news-list');
    const loadingEl = document.getElementById('loading');
    const searchInput = document.getElementById('search-input');
    const btnSearch = document.getElementById('btn-search');
    const categorySelect = document.getElementById('category');

    let allNews = [];
    let filteredNews = [];
    const suggestionsEl = document.getElementById('suggestions'); // gợi ý tìm kiếm

    function showSuggestions(keyword) {
  const keywordLower = keyword.toLowerCase();
  const matches = allNews.filter(news =>
    news.title.toLowerCase().includes(keywordLower)
  ).slice(0, 5); 

  suggestionsEl.innerHTML = '';
  matches.forEach(match => {
    const item = document.createElement('li');
    item.className = 'list-group-item list-group-item-action';
    item.textContent = match.title;
    item.addEventListener('click', () => {
      searchInput.value = match.title;
      suggestionsEl.classList.add('d-none');
      filterAndRender();
    });
    suggestionsEl.appendChild(item);
  });

  suggestionsEl.classList.remove('d-none');
}

    function showLoading() {
      loadingEl.classList.remove('d-none');
      newsListEl.classList.add('d-none');
    }
  
    function hideLoading() {
      loadingEl.classList.add('d-none');
      newsListEl.classList.remove('d-none');
    }
  // Phân trang
    function renderNews(arr) {
      newsListEl.innerHTML = '';
      if (arr.length === 0) {
        newsListEl.innerHTML = `
          <div class="col-12 text-center">
            <p class="text-muted">Không tìm thấy tin phù hợp.</p>
          </div>
        `;
        return;
      }
  
      arr.forEach((news) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${news.image_url}" class="card-img-top" alt="Ảnh tin"/>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${news.title}</h5>
              <p class="card-text flex-grow-1">${news.description}</p>
              <p class="text-muted mb-1">
                
              </p>
              <div class="mt-auto">
                <a href="detail.html?id=${news.id}" class="btn btn-primary btn-sm">Xem chi tiết</a>
              </div>
            </div>
          </div>
        `;
        newsListEl.appendChild(col);
      });
    }
    let currentPage = 1;
const itemsPerPage = 9;
const paginationEl = document.getElementById('pagination');

 function renderNewsPaginated(arr, page) {
  newsListEl.innerHTML = '';
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = arr.slice(start, end);

  if (pageItems.length === 0) {
    newsListEl.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-muted">Không tìm thấy tin phù hợp.</p>
      </div>`;
    return;
  }
function formatDate(dateStr) {
  if (!dateStr) return 'Không rõ';
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

  pageItems.forEach((news) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${news.image_url}" class="card-img-top" alt="Ảnh tin" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${news.title}</h5>
          <p class="card-text flex-grow-1">${news.description}</p>
          <p class="text-muted mb-1"><small>${news.published_at} | ${news.source}</small></p>
          <div class="mt-auto">
            <a href="detail.html?id=${news.id}" class="btn btn-primary btn-sm">Xem chi tiết</a>
          </div>
        </div>
      </div>`;
    newsListEl.appendChild(col);
  });}


function renderPagination(arr) {
  paginationEl.innerHTML = '';
  const totalPages = Math.ceil(arr.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<button class="page-link">${i}</button>`;
    li.addEventListener('click', () => {
      currentPage = i;
      renderNewsPaginated(filteredNews, currentPage);
      renderPagination(filteredNews);
    });
    paginationEl.appendChild(li);
  }

  paginationEl.classList.toggle('d-none', totalPages <= 1);
}


    function filterAndRender() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;
  filteredNews = allNews.filter((news) => {
    const inKeyword =
      news.title.toLowerCase().includes(keyword) ||
      news.description.toLowerCase().includes(keyword);
    const inCategory =
      selectedCategory === '' || news.category === selectedCategory;
    return inKeyword && inCategory;
  });

  currentPage = 1;
  renderNewsPaginated(filteredNews, currentPage);
  renderPagination(filteredNews);
}

  
    showLoading();
  
    fetch('api.php')
      .then((res) => res.json())
      .then((data) => {
        allNews = data;
        filteredNews = data;
        hideLoading();
        filterAndRender();
      })
      .catch((err) => {
        console.error('Không load được dữ liệu:', err);
        loadingEl.innerHTML = `<p class="text-danger">Không thể tải dữ liệu.</p>`;
      });
  
    btnSearch.addEventListener('click', () => {
      filterAndRender();
    });
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        filterAndRender();
      }
    });
  
    categorySelect.addEventListener('change', () => {
      filterAndRender();
    });
  });
  
