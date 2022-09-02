const {
  filterStudents,
  isApproved,
  isFailed,
} = require('./filterStudents-v2');

const bruna = { name: 'Bruna', average: 9.5 };
const natalia = { name: 'Natália', average: 6.5 }; // !!!
const tiago = { name: 'Tiago', average: 6.4 }; // !!!
const diogo =  { name: 'Diogo', average: 5.5 };
const julia = { name: 'Julia', average: 3.4 };

//
// average: 6.5
//

describe('filterStudents() - approved', () => {
  describe('when the array is empty', () => {
    it('should return an empty array', () => {
      expect(filterStudents([], isApproved)).toEqual([]);
    });
  });

  describe('when the array contains only students who failed', () => {
    it('should return an empty array', () => {
      const failedStudents = [tiago, diogo, julia];

      expect(filterStudents(failedStudents, isApproved)).toEqual([]);
    });
  });

  describe('when the array contains only students who passed', () => {
    it('should return the array itself', () => {
      const approvedStudents = [bruna, natalia];

      expect(filterStudents(approvedStudents, isApproved)).toEqual(approvedStudents);
    });
  });

  describe('when the array contains a mix of students', () => {
    it('should return only students who passed', () => {
      const mixedStudents = [bruna, natalia, tiago, diogo, julia];
      const expectedApprovedStudents = [bruna, natalia];

      expect(filterStudents(mixedStudents, isApproved)).toEqual(expectedApprovedStudents);
    });
  });
});

describe('filterStudents() -- failed', () => {
  describe('when the array is empty', () => {
    it('should return an empty array', () => {
      expect(filterStudents([], isFailed)).toEqual([]);
    });
  });

  describe('when the array contains only students who passed', () => {
    it('should return an empty array', () => {
      const approvedStudents = [bruna, natalia];

      expect(filterStudents(approvedStudents, isFailed)).toEqual([]);
    });
  });

  describe('when the array contains only students who failed', () => {
    it('should return the array itself', () => {
      const failedStudents = [tiago, diogo, julia];

      expect(filterStudents(failedStudents, isFailed)).toEqual(failedStudents);
    });
  });

  describe('when the array contains a mix of students', () => {
    it('should return only students who passed', () => {
      const mixedStudents = [bruna, natalia, tiago, diogo, julia];
      const expectedFailedStudents = [tiago, diogo, julia];

      expect(filterStudents(mixedStudents, isFailed)).toEqual(expectedFailedStudents);
    });
  });
});
