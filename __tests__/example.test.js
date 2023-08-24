

describe('example test', () => {
    it('should recognise truth', () => {
        // Arrange
        const value = true

        // Act
        const actual = true === value

        // Assert
        expect(actual).toEqual(true)
    })
})