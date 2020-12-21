import { PrismaService } from '@app/common/services/prisma.service';
import { PaginationArgs } from '@app/common/pagination/pagination.args';
import { PostIdArgs } from './dto/post-id.args';
import { UserIdArgs } from './dto/user-id.args';
import { Resolver, Query, Parent, Args, ResolveField } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostOrder } from './dto/post-order.input';
import { PostConnection } from '@app/features/post/models/post-connection.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';

@Resolver((_of) => Post)
export class PostResolver {
  constructor(private prisma: PrismaService) {}

  @Query((_returns) => PostConnection)
  async publishedPosts(
    @Args() { skip, after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => PostOrder,
      nullable: true,
    })
    orderBy: PostOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.post.findMany({
          include: { author: true },
          where: {
            published: true,
            title: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : null,
          ...args,
        }),
      () =>
        this.prisma.post.count({
          where: {
            published: true,
            title: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
    return a;
  }

  @Query((_returns) => [Post])
  userPosts(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .posts({ where: { published: true } });

    // or
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  @Query((_returns) => Post)
  async post(@Args() id: PostIdArgs) {
    return this.prisma.post.findUnique({ where: { id: id.postId } });
  }

  @ResolveField('author')
  async author(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).author();
  }
}
