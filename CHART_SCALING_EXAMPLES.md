# Chart X-Axis Scaling Examples

This demonstrates how the new x-axis scaling works for integer data:

## Scaling Logic

The chart now uses intuitive intervals for integer data instead of arbitrary numbers:

### Small Values (≤ 10)

-  Data: [3, 7, 5]
-  Max value: 7
-  Target max: max(10, 7 \* 1.1) = 10
-  **Scale: 0 to 10**

### Small-Medium Values (≤ 20)

-  Data: [12, 18, 15]
-  Max value: 18
-  Target max: 18 \* 1.1 = 19.8
-  **Scale: 0 to 20**

### Medium Values (≤ 50)

-  Data: [25, 31, 28]
-  Max value: 31
-  Target max: 31 \* 1.1 = 34.1
-  **Scale: 0 to 50**

### Medium-Large Values (≤ 100)

-  Data: [65, 78, 82]
-  Max value: 82
-  Target max: 82 \* 1.1 = 90.2
-  **Scale: 0 to 100**

### Large Values (≤ 200)

-  Data: [125, 156, 89]
-  Max value: 156
-  Target max: 156 \* 1.1 = 171.6
-  **Scale: 0 to 200**

### Very Large Values (> 500)

-  Data: [850, 1200, 950]
-  Max value: 1200
-  Target max: 1200 \* 1.1 = 1320
-  **Scale: 0 to 1400** (rounded to nearest 100)

## Benefits

1. **Minimum of 10**: Even with very small values (like 1, 2, 3), the chart will scale 0-10 for readability
2. **Round Numbers**: X-axis always shows nice round intervals (10, 20, 50, 100, 200, 500, etc.)
3. **Intuitive Ticks**: With 5 tick marks, you get clean intervals like 0, 10, 20, 30, 40, 50
4. **Proper Spacing**: Bars have appropriate visual spacing instead of being cramped at the left

## Implementation

The logic checks the maximum data value + 10% and maps it to the next appropriate scale:

-  Values up to 10 → scale to 10
-  Values 10-20 → scale to 20
-  Values 20-50 → scale to 50
-  Values 50-100 → scale to 100
-  Values 100-200 → scale to 200
-  Values 200-500 → scale to 500
-  Values > 500 → scale to nearest 100
