// 게시글 데이터를 담을 배열
let posts = [];

// 글 등록 함수
function addPost() {
    const author = document.getElementById('authorInput').value.trim();
    const content = document.getElementById('contentInput').value.trim();
    const imageInput = document.getElementById('imageInput');
    
    if (!author || !content) {
        alert('이름과 내용을 모두 입력해주세요!');
        return;
    }

    const newPost = {
        id: Date.now(),
        author: author,
        content: content,
        image: null,
        comments: [],
        date: new Date().toLocaleDateString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    // 이미지가 업로드된 경우 처리
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.image = e.target.result; // 이미지 base64 데이터 저장
            posts.unshift(newPost); // 최신글이 위로 오도록 추가
            renderPosts();
            resetForm();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        posts.unshift(newPost);
        renderPosts();
        resetForm();
    }
}

// 폼 초기화
function resetForm() {
    document.getElementById('authorInput').value = '';
    document.getElementById('contentInput').value = '';
    document.getElementById('imageInput').value = '';
}

// 댓글 등록 함수
function addComment(postId) {
    const nameInput = document.getElementById(`commentName-${postId}`);
    const textInput = document.getElementById(`commentText-${postId}`);
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
        alert('이름과 댓글 내용을 입력해주세요!');
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({ name, text });
        renderPosts();
    }
}

// 화면에 게시글 및 댓글 그리기
function renderPosts() {
    const feed = document.getElementById('postsFeed');
    feed.innerHTML = ''; // 기존 내용 비우기

    posts.forEach(post => {
        // 게시글 HTML 구성
        let postHTML = `
            <div class="post-card">
                <div class="post-header">
                    <span class="post-author">👤 ${post.author}</span>
                    <span>${post.date}</span>
                </div>
                <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
        `;

        // 이미지가 있으면 이미지 태그 추가
        if (post.image) {
            postHTML += `<img src="${post.image}" class="post-image" alt="업로드 이미지">`;
        }

        // 댓글 영역 시작
        postHTML += `
            <div class="comment-section">
                <ul class="comment-list">
        `;

        // 댓글 목록 추가
        post.comments.forEach(comment => {
            postHTML += `
                <li class="comment-item">
                    <strong>${comment.name}:</strong> ${comment.text}
                </li>
            `;
        });

        // 댓글 작성 폼 추가
        postHTML += `
                </ul>
                <div class="comment-form">
                    <input type="text" id="commentName-${post.id}" class="comment-name" placeholder="이름">
                    <input type="text" id="commentText-${post.id}" class="comment-text" placeholder="의견을 남겨주세요!">
                    <button class="comment-btn" onclick="addComment(${post.id})">등록</button>
                </div>
            </div>
        </div>
        `;

        feed.innerHTML += postHTML;
    });
}
