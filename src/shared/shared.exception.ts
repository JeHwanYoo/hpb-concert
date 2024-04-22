export class DomainException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainException'
  }
}

export class NotFoundDomainException extends DomainException {
  constructor() {
    super('Not Found')
    this.name = 'NotFoundDomainException'
  }
}
