export default {
    SERVER : {
        saved_email_is_different : "요청한 이메일 주소와 가입할 이메일주소가 다릅니다.",
        this_email_is_already_registerd : '해당 이메일은 이미 등록된 메일입니다.',
        send_invitation_code_success : "이메일로 코드를 전송하였습니다.(없을 경우 스팸메일함도 확인해주세요)",
        user_invitation_is_not_existed : '전송된 이메일 코드가 없습니다. 이메일코드를 먼저 요청해주세요',
        can_not_read_user_status : '유저 정보를 읽을수 없습니다',
        internal_server_error : '서버 에러입니다.',
        log_in_please : '로그인이 필요합니다.',
        freeboard_is_not_existed : '게시물이 존재하지 않습니다. 잠시후 리스트로 이동합니다.',
        freeboard_already_upvote : '이미 추천하셨습니다.',
        freeboard_upvote_success : '성공적으로 추천했습니다.',
        user_profile_update_success : "유저 프로필이 성공적으로 업데이트 되었습니다.",
        need_log_in : '로그인이 필요합니다.',
        no_user_found : '해당 이메일은 존재하지 않습니다',
        wrong_password : '패스워드가 일치하지 않습니다',

    },
    MODAL :{
        COMMON : {
            CLOSE : '닫기',
            EDIT : '수정',
            REQUEST : '요청',
        },
        I18N : {
            HEADER : '언어 선택',
            LANG_KR : '한국어',
            LANG_EN : '영어',
            SELECT_CHANGES : '변경',
            CLOSE : '닫기'
        },
        SIGN_IN : {
            HEADER : '로그인',
            ON_SIGN_IN : '로그인',
            ON_CLOSE : '닫기'
        },
        REGISTER : {
            USERNAME_PLACEHOLDER : "2글자 이상 10글자이하로 가능합니다",
        },
        ACCOUNT_SETTING : {
            HEADER : '계정설정',
            USERNAME : '유저이름',
            BATTLETAG : '배틀태그',
            PASSWORD : '패스워드',
            PASSWORD_EDIT : '패스워드 수정',
            PASSWORD_EDIT_CONFIRM : '패스워드 수정 확인',
            REGISTER : '등록',
            EDIT : '수정',
            SAVE_CHANGES : '변경사항 저장',
            NOT_REGISTERED_BATTLETAG : '등록된 배틀태그가 없습니다.',
        },
    },
    NOTY : {
        SIGN_UP : {
            REGISTER_SUCCESS : "가입 성공",
        },
        ACCOUNT_SETTING : {
            SIGN_IN_SUCCESS : '로그인 성공',
            SIGN_IN_FAIL : "로그인 실패",
            SIGN_OUT_SUCCESS : "로그아웃 성공",
            SIGN_OUT_FAIL : "로그아웃 실패",
        },
        FREEBOARD : {
            TITLE_IS_NULL : '제목을 입력하여 주십시요',
            TITLE_IS_LONG : '제목이 너무 깁니다.',
            CONTENT_IS_LONG : '내용이 너무 깁니다.',
            CONTENT_IS_SHORT : '내용이 너무 적습니다.',
            WRITING_SUCCESS : '성공적으로 저장했습니다. 잠시후 목록으로 이동합니다.',
            WRITING_NEED_USER_LOGIN : '글을 쓰시려면 로그인해주세요.'
        },
        FREEBOARD_COMMENT : {
            INVALID : '코멘트는 최소 5자 이상 300자 이하로 입력해주세요',
            POST_FAIL : '에러발생, 코멘트를 등록하지 못했습니다.',
        },
    },
    NAV : {
        BOARD : '게시판',
        BUG_REPORT : '버그신고',
        SCRIM : '스크림'
    },
    FREEBOARD : {
        LIST : {
            SEARCH : "검색",
            SORT : "정렬",
            WRITING : "글쓰기",
            UP : "위로",
        },
        DETAIL : {
            UPVOTE_COUNT : '추천수',
            VIEW_COUNT : '조회수',
            CREATED_AT : '작성일',
            UPVOTE : '추천',
            MODIFY : '수정',
            DELETE : '삭제',
            WRITE_COMMENT : '댓글작성',
            POST_COMMENT : '등록',
            GO_LIST : '목록으로',
        },
    },
    WRITING: {
        TITLE_PLACE_HOLDER : '제목을 입력하세요',
        WRITE : '저장',
        CANCLE : '취소',
        TEMPORARY_SAVE : '임시저장',
        VIEWS : '조회',
        UPVOTES : '추천',
        ANSWERS : '답변'
    },
    REGISTER : {
        USER_NAME : '유저 이름',
        EMAIL     : '이메일',
        EMAIL_INVITATION_CODE : '이메일 확인 코드',
        PASSWORD    : '암호',
        PASSWORD_CONFIRM    : '암호확인'
    }
}