document.addEventListener('DOMContentLoaded', () => {
    const newsListEl = document.getElementById('news-list');
    const loadingEl = document.getElementById('loading');
    const searchInput = document.getElementById('search-input');
    const btnSearch = document.getElementById('btn-search');
    const categorySelect = document.getElementById('category');
  
    let allNews = [];
    let filteredNews = [];
  
    function showLoading() {
      loadingEl.classList.remove('d-none');
      newsListEl.classList.add('d-none');
    }
  
    function hideLoading() {
      loadingEl.classList.add('d-none');
      newsListEl.classList.remove('d-none');
    }
  
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
            <img
              src="${news.image_url}"
              class="card-img-top"
              alt="Ảnh tin"
            />
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
  
      renderNews(filteredNews);
    }
  
    showLoading();
  
    fetch('api.php')
      .then((res) => res.json())
      .then((data) => {
        allNews = data;
        filteredNews = data;
        hideLoading();
        renderNews(allNews);
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
  