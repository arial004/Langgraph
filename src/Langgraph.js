import {StateGraph, END} from '@langchain/langgraph';

const graphState = {
  topic: {value (x,y) => y, default: () => ''},
  draft: {value (x,y) => y, default: () => ''},
  feedback: {value (x,y) => y, default: () => ''},
  isApproved: {value (x,y) => y, default: () => false},
};

async function writerNode(state){
  console.log('[writer] 작성중');
  const newDraft = state.feedback ? `[수정본] ${state.topic} - 반영된 피드백: ${state.feedback}` : `[초안] ${state.topic}`;

  retrun {draft: newDraft};
}

async function reviewerNode(state){
  console.log('[reviewer] 검토중');
  const isGood = state.draft.includes('수정본');

  if(isGood){
    return {isApproved: true, feedback: 'good. pass'};
  }else{
    return {isApproved: false, feedback: 'bad. write longer'};
  }
}

function shouldContinue(state){
  if(state.isApproved){
    console.log('[router] 완료');
    return END;
  }else{
    console.log('[router] 반려');
    return 'writer';
  }
}

const workflow = new StateGraph({channels: graphState})
  .addNode('writer', writeNode)
  .addNode('reviewer', reviewerNode)
  .addEdge('writer', 'reviewer') //작성 후 무조건 리뷰어에게 전달
  .addConditionalEdges('reviewer', shouldContinue); // 리뷰 후에 로직 실행

workflow.setEntryPoint('writer');
const app = workflow.compile();

async function main(){
  const initialState = {topic: 'LangGraph 의 이해'};

  const finalState = await app.invoke(initialState);
  console.log('[result] : '+ finalState.draft);
}
