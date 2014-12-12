/*
 * @author paper
 * 快速排序
 */
function quickSort(r){

    function quickSortMain(left, right){
        if (right > left) {
            var mid = Math.floor((left + right) / 2);
            var pivot = partition(left, right, mid);
            
            quickSortMain(left, pivot - 1);
            quickSortMain(pivot + 1, right);
        }
        
        return r;
    };
    
    function partition(left, right, pivotIndex){
        var pivotValue = r[pivotIndex];
        swap(right, pivotIndex);
        var storeIndex = left;
        
        for (var i = left; i < right; i++) {
            if (r[i] < pivotValue) {
                swap(i, storeIndex);
                storeIndex++;
            }
        }
        
        swap(storeIndex, right);
        
        return storeIndex;
    };
    
    //a,b两个下标数据交换
    function swap(a, b){
        if (a == b) return;
        var t = r[a];
        r[a] = r[b];
        r[b] = t;
    };
    
    if (r.length < 2) return r;
    return quickSortMain(0, r.length - 1);
};

function jsQS(r){
    return r.sort(function(a, b){
        //return a < b ? -1 : 1;
		return a-b;
    });
};
