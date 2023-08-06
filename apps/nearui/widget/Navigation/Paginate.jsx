// Pagination built off of https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/

const RANGE_ITEM = "...";
const siblingCount = props.siblingCount ?? 1;
const totalCount = props.totalCount ?? 100;
const pageSize = props.pageSize ?? 10;
const totalPageCount = props.totalPageCount ?? Math.ceil(totalCount / pageSize);
const onPageChange =
  props.onPageChange ??
  ((pageNumber) => {
    console.log(`Clicked ${pageNumber}`);
  });
const currentPage = props.currentPage ?? 1;
const revaluateOnRender = props.revaluateOnRender ?? false;

// Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
const totalPageNumbers = siblingCount + 5;

const PaginationContainer =
  props.paginationContainer ??
  styled.ul`
    display: flex;
    list-style-type: none;
    margin: 0;
  `;

const PaginationItem =
  props.paginationItem ??
  styled.li`
    padding: 0 12px;
    height: 32px;
    text-align: center;
    margin: auto 4px;
    color: rgba(0, 0, 0, 0.87);
    display: flex;
    box-sizing: border-box;
    align-items: center;
    letter-spacing: 0.01071em;
    border-radius: 16px;
    line-height: 1.43;
    font-size: 13px;
    min-width: 32px;

    &.dots:hover {
      background-color: transparent;
      cursor: default;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      cursor: pointer;
    }

    &.selected {
      background-color: rgba(0, 0, 0, 0.08);
    }

    .arrow {
      &::before {
        position: relative;
        /* top: 3pt; Uncomment this to lower the icons as requested in comments*/
        content: "";
        /* By using an em scale, the arrows will size with the font */
        display: inline-block;
        width: 0.4em;
        height: 0.4em;
        border-right: 0.12em solid rgba(0, 0, 0, 0.87);
        border-top: 0.12em solid rgba(0, 0, 0, 0.87);
      }

      &.left {
        transform: rotate(-135deg) translate(-50%);
      }

      &.right {
        transform: rotate(45deg);
      }
    }

    &.disabled {
      pointer-events: none;

      .arrow::before {
        border-right: 0.12em solid rgba(0, 0, 0, 0.43);
        border-top: 0.12em solid rgba(0, 0, 0, 0.43);
      }

      &:hover {
        background-color: transparent;
        cursor: default;
      }
    }
  `;

// Create an array of certain length and set the elements within it from
// start value to end value.
const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const viewRange = (currentPage) => {
  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount);
  }

  // Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPageCount,
  );

  // We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  // Case 2: No left dots to show, but rights dots to be shown
  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = range(1, leftItemCount);

    return [...leftRange, RANGE_ITEM, totalPageCount];
  }

  // Case 3: No right dots to show, but left dots to be shown
  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
    return [firstPageIndex, RANGE_ITEM, ...rightRange];
  }

  // Case 4: Both left and right dots to be shown
  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [
      firstPageIndex,
      RANGE_ITEM,
      ...middleRange,
      RANGE_ITEM,
      lastPageIndex,
    ];
  }
};

const onClickPage = (pageNumber) => {
  if (pageNumber == RANGE_ITEM) {
    return;
  }

  const pageRanges = viewRange(pageNumber);
  State.update({
    pageRanges,
  });

  return onPageChange(pageNumber);
};

initState({
  pageRanges: viewRange(0),
});

if (revaluateOnRender) {
  const pageRanges = viewRange(currentPage);
  State.update({
    pageRanges,
  });
}

return (
  <PaginationContainer>
    {state.pageRanges &&
      state.pageRanges.map((pageNumber) => (
        <PaginationItem
          onClick={() => onClickPage(pageNumber)}
          key={`page-${pageNumber}`}
          className={pageNumber === currentPage ? "selected" : ""}
        >
          {pageNumber !== RANGE_ITEM ? pageNumber : <>&#8230;</>}
        </PaginationItem>
      ))}
  </PaginationContainer>
);
