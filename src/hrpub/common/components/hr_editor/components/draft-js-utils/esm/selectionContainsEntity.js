import getSelectedBlocks from './getSelectedBlocks';
export default (function (strategy) {
  return function (editorState, selection) {
    var contentState = editorState.getCurrentContent();
    var currentSelection = selection || editorState.getSelection();
    var startKey = currentSelection.getStartKey();
    var endKey = currentSelection.getEndKey();
    var startOffset = currentSelection.getStartOffset();
    var endOffset = currentSelection.getEndOffset();
    var isSameBlock = startKey === endKey;
    var selectedBlocks = getSelectedBlocks(contentState, startKey, endKey);
    var entityFound = false; // We have to shift the offset to not get false positives when selecting
    // a character just before or after an entity

    var finalStartOffset = startOffset + 1;
    var finalEndOffset = endOffset - 1;
    selectedBlocks.forEach(function (block) {
      strategy(block, function (start, end) {
        if (entityFound) {
          return;
        }

        var blockKey = block.getKey();

        if (isSameBlock && (end < finalStartOffset || start > finalEndOffset)) {
          return;
        } else if (blockKey === startKey && end < finalStartOffset) {
          return;
        } else if (blockKey === endKey && start > finalEndOffset) {
          return;
        }

        entityFound = true;
      }, contentState);
    });
    return entityFound;
  };
});