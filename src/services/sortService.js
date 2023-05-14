/**
     * @description sort feature.
     * 5. sort popular
     * 6. sort price
     * 7. sort reviews count
     * 8. sort Discount
     */
export default {
  sort: (sortCondition, sourceData) => {
    const filledResults = [];
    try { //eslint-disable-line
      switch (sortCondition) {
        case 'isPopular': {
          const zeorList = [];
          sourceData.results.map((hotel) => {
            if (
              hotel.property.reviews &&
              hotel.property.reviews.summary &&
              hotel.property.reviews.summary.popularity
            ) {
              filledResults.push(hotel);
            } else {
              zeorList.push(hotel);
            }
            return hotel;
          });

          console.log('sort by popular sequence');
          let tempOne = {};
          for (let i = 0; i < filledResults.length - 1; i++) {
            for (let j = 0; j < filledResults.length - 1 - i; j++) {
              if (
                filledResults[j].property.reviews.summary.popularity <
                filledResults[j + 1].property.reviews.summary.popularity
              ) {
                tempOne = filledResults[j + 1];
                filledResults[j + 1] = filledResults[j];
                filledResults[j] = tempOne;
              }
            }
            console.log(filledResults[i].property.reviews.summary.popularity);
          }

          filledResults.push(...zeorList);
          break;
        }
        case 'isPrice':
          break;
        case 'isReview':
          break;
        case 'isDiscount':
          break;
        default:
          break;
      }

      console.log('after filtering', filledResults);
      return filledResults;
    } catch (error) {
      throw error;
    }
  },
};
