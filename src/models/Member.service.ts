import { shapeIntoMongooseObjectId } from "../libs/config";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import bcrypt from "bcryptjs";

class MemberService {
 private readonly memberModel;
 constructor() {
    this.memberModel = MemberModel;
 }
 // ******************************************** //
 //     ***********   REACT     *********        //
 // ******************************************** //
public async signup(input: MemberInput): Promise<Member> {
    
    const salt = await bcrypt.genSalt()
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    try{
        const result = await this.memberModel.create(input);
        result.memberPassword = "";
        return result.toJSON();
    } catch(err) {
        console.error('Error, model:signup', err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }  
 };


  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne({memberNick: input.memberNick,
                memberStatus: {$ne: MemberStatus.DELETE}
              },
               {memberNick: 1, memberPassword: 1, memberStatus: 1})
      .exec();
  
    if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
     else if(member.memberStatus === MemberStatus.BLOCK) {
        throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER)
      }

    const isMatch = await bcrypt.compare(
        input.memberPassword,
        member.memberPassword
    );

    if(!isMatch) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    return await this.memberModel.findById(member._id).lean().exec();

  }

  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
    .findOne({_id: memberId, memberStatus: MemberStatus.ACTIVE })
    .exec();
    if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }


  public async updateMember(
    member: Member, 
    input: MemberUpdateInput
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = this.memberModel
    .findOneAndUpdate({_id: memberId}, input, {new: true, runValidators: true})
    .exec();

    if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }














 // ******************************************** //
 //     ***********   BSSR      *********        //
 // ******************************************** //
 public async processSignup(input: MemberInput): Promise<Member> {

     const exist  = await this.memberModel
     .findOne({memberType: MemberType.ADMIN})
     .exec();
     console.log("exist:", exist)
     if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      const salt = await bcrypt.genSalt()
      input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try{
        const result = await this.memberModel.create(input);
        result.memberPassword = "";


        return result;
    


    } catch(err) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }  
 };


  public async processLogin(input: LoginInput): Promise<Member> {
    console.log("input", input)
    const member = await this.memberModel
    .findOne(
        {memberNick: input.memberNick}, 
        {memberNick: 1, memberPassword: 1})
    .exec();
    console.log("member", member)
    if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    
    const isMatch = await bcrypt.compare(
        input.memberPassword,
        member.memberPassword
    );

    if(!isMatch) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    return await this.memberModel.findById(member._id).exec();

  }



   public async getUsers(): Promise<Member[]> {

    try{
        const result = await this.memberModel
        .find({memberType: MemberType.USER})
        .exec()
        if(!result.length) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    } catch(err) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }  
 };

     public async updateChosenUser(input: MemberUpdateInput ): Promise<Member> {
      input._id = shapeIntoMongooseObjectId(input._id);
      const result = await this.memberModel.findByIdAndUpdate({_id: input._id}, input, {new: true, runValidators: true})

      if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

      return result;
      
      
    };




}


export default MemberService;