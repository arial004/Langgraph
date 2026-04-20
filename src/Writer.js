import axios from 'axios';

const LLMConfig = {
  method : 'post',
  header : {
    'Authorization': 'Bearer',
    'Content-Type': 'application/json',
  },
  data: {
    'message': [
      {
        'content': `
          너는 뛰어난 Javascript 개발자야.
          코딩을 하되, 일반 평문 답변은 한글로 해줘.
          너는 코딩을 하지만, user 내용에 수정사항에 대한 피드백이 들어오면 이를 적극적으로 반영해서 코드를 수정해줘야돼.
          [수정본] <내용> - 반영된 피드백: <피드백> 형태로 값이 들어오면 너는 <피드백> 내용을 참고해서 <내용> 부분을 수정해줘야돼.
          가장 중요한 요인은 실행이 가능한지야
          개발 환경은 다음과 같아 - [Windows 11, nodejs 18 버전, 폐쇄망 환경, 패키지 다운로드는 가능하나 https 접근은 불가. 리눅스용 서버 보유]
          너의 출력 형태는 다음과 같아
        `,
        'role': 'system',
      }
    ],
    'model': '',
    'max_completion_tokens': ,
    'temperature': 0.3,
  },
};

export default async function writer (state) {
  const initialQuestion = 'LangGraph 구현 방식 설명과 예시 작성해줘'; 
  const newDraft = state.feedback? `[수정본] ${state.topic} - 반영된 피드백: ${state.feedback}` : initialQuestion;
  LLMConfig.data.message[1] = {content: newDraft, role: 'user'}
  const res = await axios.request('<address>', LLMConfig);
  return {draft: res.data.choices[0].message};
}
